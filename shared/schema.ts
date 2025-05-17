import { pgTable, text, timestamp, serial, integer, boolean, pgEnum, date, time } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

// ユーザータイプ（一般ユーザー or ガイド）の列挙型
export const userTypeEnum = pgEnum('user_type', ['tourist', 'guide']);

// 電話番号認証ステータスの列挙型
export const phoneVerificationStatusEnum = pgEnum('phone_verification_status', ['unverified', 'pending', 'verified']);

// 身分証明書検証ステータスの列挙型
export const idVerificationStatusEnum = pgEnum('id_verification_status', ['unverified', 'pending', 'verified', 'rejected']);

// 曜日の列挙型
export const dayOfWeekEnum = pgEnum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

// ユーザーテーブル
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  type: userTypeEnum('type').notNull().default('tourist'),
  profileImage: text('profile_image'),
  bio: text('bio'),
  
  // 電話番号関連
  phoneNumber: text('phone_number'),
  phoneVerificationStatus: phoneVerificationStatusEnum('phone_verification_status').default('unverified').notNull(),
  phoneVerificationCode: text('phone_verification_code'),
  phoneVerificationExpiry: timestamp('phone_verification_expiry'),
  
  // Firebase関連（電話認証のため）
  firebaseUid: text('firebase_uid'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ガイドプロフィールテーブル
export const guideProfiles = pgTable('guide_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  specialties: text('specialties').array(),
  languages: text('languages').array(),
  pricePerHour: integer('price_per_hour'),
  availability: text('availability'), // 曜日と時間帯の情報を格納
  city: text('city').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 予約ステータスの列挙型
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);

// 予約テーブル
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  touristId: integer('tourist_id').notNull().references(() => users.id),
  guideId: integer('guide_id').notNull().references(() => users.id),
  date: timestamp('date').notNull(),
  duration: integer('duration').notNull(), // 時間単位
  location: text('location').notNull(), // 集合場所
  notes: text('notes'),
  status: bookingStatusEnum('status').default('pending').notNull(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// レビューテーブル
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  reviewerId: integer('reviewer_id').notNull().references(() => users.id),
  reviewedId: integer('reviewed_id').notNull().references(() => users.id),
  rating: integer('rating').notNull(), // 1-5の評価
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// 身分証明書テーブル
export const idDocuments = pgTable('id_documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  documentType: text('document_type').notNull(), // パスポート、運転免許証、マイナンバーカードなど
  documentPath: text('document_path').notNull(), // S3またはFirebase Storageのパス
  verificationStatus: idVerificationStatusEnum('verification_status').default('pending').notNull(),
  verificationNotes: text('verification_notes'), // 管理者からのフィードバック
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  verifiedAt: timestamp('verified_at')
});

// ガイドの定期的なスケジュールテーブル（毎週の空き時間）
export const guideSchedules = pgTable('guide_schedules', {
  id: serial('id').primaryKey(),
  guideId: integer('guide_id').notNull().references(() => users.id),
  dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ガイドの特定日のスケジュール例外テーブル（休日や特別な日など）
export const guideScheduleExceptions = pgTable('guide_schedule_exceptions', {
  id: serial('id').primaryKey(),
  guideId: integer('guide_id').notNull().references(() => users.id),
  exceptionDate: date('exception_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  isAvailable: boolean('is_available').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// リレーション定義
export const usersRelations = relations(users, ({ many, one }) => ({
  guideProfile: one(guideProfiles, {
    fields: [users.id],
    references: [guideProfiles.userId],
  }),
  idDocuments: many(idDocuments),
  givenBookings: many(bookings, { relationName: 'tourist_bookings' }),
  receivedBookings: many(bookings, { relationName: 'guide_bookings' }),
  givenReviews: many(reviews, { relationName: 'reviewer' }),
  receivedReviews: many(reviews, { relationName: 'reviewed' }),
  schedules: many(guideSchedules),
  scheduleExceptions: many(guideScheduleExceptions)
}));

export const guideProfilesRelations = relations(guideProfiles, ({ one }) => ({
  user: one(users, {
    fields: [guideProfiles.userId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  tourist: one(users, {
    relationName: 'tourist_bookings',
    fields: [bookings.touristId],
    references: [users.id],
  }),
  guide: one(users, {
    relationName: 'guide_bookings',
    fields: [bookings.guideId],
    references: [users.id],
  }),
  reviews: many(reviews)
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  reviewer: one(users, {
    relationName: 'reviewer',
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
  reviewed: one(users, {
    relationName: 'reviewed',
    fields: [reviews.reviewedId],
    references: [users.id],
  }),
}));

export const idDocumentsRelations = relations(idDocuments, ({ one }) => ({
  user: one(users, {
    fields: [idDocuments.userId],
    references: [users.id],
  }),
}));

export const guideSchedulesRelations = relations(guideSchedules, ({ one }) => ({
  guide: one(users, {
    fields: [guideSchedules.guideId],
    references: [users.id],
  }),
}));

export const guideScheduleExceptionsRelations = relations(guideScheduleExceptions, ({ one }) => ({
  guide: one(users, {
    fields: [guideScheduleExceptions.guideId],
    references: [users.id],
  }),
}));

// 型の定義
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type GuideProfile = InferSelectModel<typeof guideProfiles>;
export type InsertGuideProfile = InferInsertModel<typeof guideProfiles>;

export type Booking = InferSelectModel<typeof bookings>;
export type InsertBooking = InferInsertModel<typeof bookings>;

export type Review = InferSelectModel<typeof reviews>;
export type InsertReview = InferInsertModel<typeof reviews>;

export type IdDocument = InferSelectModel<typeof idDocuments>;
export type InsertIdDocument = InferInsertModel<typeof idDocuments>;

export type GuideSchedule = InferSelectModel<typeof guideSchedules>;
export type InsertGuideSchedule = InferInsertModel<typeof guideSchedules>;

export type GuideScheduleException = InferSelectModel<typeof guideScheduleExceptions>;
export type InsertGuideScheduleException = InferInsertModel<typeof guideScheduleExceptions>;