import { users, guideProfiles, bookings, reviews, idDocuments, 
  bookingStatusEnum, phoneVerificationStatusEnum, idVerificationStatusEnum,
  guideSchedules, guideScheduleExceptions, dayOfWeekEnum
} from "../shared/schema";
import type { 
  User, InsertUser, 
  GuideProfile, InsertGuideProfile, 
  Booking, InsertBooking, 
  Review, InsertReview,
  IdDocument, InsertIdDocument,
  GuideSchedule, InsertGuideSchedule,
  GuideScheduleException, InsertGuideScheduleException
} from "../shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export { db };

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // ユーザー関連の操作
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // 電話番号認証関連の操作
  updatePhoneVerificationStatus(userId: number, status: string): Promise<User | undefined>;
  verifyPhoneNumber(userId: number, phoneNumber: string): Promise<User | undefined>;
  
  // 身分証明書関連の操作
  getIdDocuments(userId: number): Promise<IdDocument[]>;
  getIdDocument(id: number): Promise<IdDocument | undefined>;
  createIdDocument(insertIdDocument: InsertIdDocument): Promise<IdDocument>;
  updateIdDocumentStatus(id: number, status: string, notes?: string): Promise<IdDocument | undefined>;
  
  // ガイドプロフィール関連の操作
  getGuideProfile(userId: number): Promise<GuideProfile | undefined>;
  createGuideProfile(insertGuideProfile: InsertGuideProfile): Promise<GuideProfile>;
  updateGuideProfile(userId: number, profile: Partial<InsertGuideProfile>): Promise<GuideProfile | undefined>;
  searchGuides(city: string): Promise<(GuideProfile & { user: User })[]>;
  
  // 予約関連の操作
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByTourist(touristId: number): Promise<Booking[]>;
  getBookingsByGuide(guideId: number): Promise<Booking[]>;
  createBooking(insertBooking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: BookingStatus): Promise<Booking | undefined>;
  
  // レビュー関連の操作
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(insertReview: InsertReview): Promise<Review>;
  
  // ガイドスケジュール関連の操作
  getGuideSchedules(guideId: number): Promise<GuideSchedule[]>;
  getGuideScheduleByDay(guideId: number, dayOfWeek: string): Promise<GuideSchedule | undefined>;
  createGuideSchedule(insertSchedule: InsertGuideSchedule): Promise<GuideSchedule>;
  updateGuideSchedule(id: number, schedule: Partial<InsertGuideSchedule>): Promise<GuideSchedule | undefined>;
  deleteGuideSchedule(id: number): Promise<void>;
  
  // ガイドスケジュール例外関連の操作
  getGuideScheduleExceptions(guideId: number): Promise<GuideScheduleException[]>;
  getGuideScheduleExceptionsByDateRange(guideId: number, startDate: Date, endDate: Date): Promise<GuideScheduleException[]>;
  createGuideScheduleException(insertException: InsertGuideScheduleException): Promise<GuideScheduleException>;
  updateGuideScheduleException(id: number, exception: Partial<InsertGuideScheduleException>): Promise<GuideScheduleException | undefined>;
  deleteGuideScheduleException(id: number): Promise<void>;
  
  // 空き時間確認
  checkGuideAvailability(guideId: number, date: Date, startTime: string, endTime: string): Promise<boolean>;
  
  // セッションストア
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // ユーザー関連の実装
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // ガイドプロフィール関連の実装
  async getGuideProfile(userId: number): Promise<GuideProfile | undefined> {
    const [profile] = await db
      .select()
      .from(guideProfiles)
      .where(eq(guideProfiles.userId, userId));
    return profile || undefined;
  }

  async createGuideProfile(insertGuideProfile: InsertGuideProfile): Promise<GuideProfile> {
    const [profile] = await db
      .insert(guideProfiles)
      .values(insertGuideProfile)
      .returning();
    return profile;
  }

  async updateGuideProfile(userId: number, updateData: Partial<InsertGuideProfile>): Promise<GuideProfile | undefined> {
    const [updatedProfile] = await db
      .update(guideProfiles)
      .set(updateData)
      .where(eq(guideProfiles.userId, userId))
      .returning();
    return updatedProfile || undefined;
  }

  async searchGuides(city: string): Promise<(GuideProfile & { user: User })[]> {
    const result = await db
      .select({
        guideProfile: guideProfiles,
        user: users
      })
      .from(guideProfiles)
      .innerJoin(users, eq(guideProfiles.userId, users.id))
      .where(eq(guideProfiles.city, city));
    
    return result.map(r => ({ ...r.guideProfile, user: r.user }));
  }

  // 予約関連の実装
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByTourist(touristId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.touristId, touristId));
  }

  async getBookingsByGuide(guideId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.guideId, guideId));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  // レビュー関連の実装
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));
    return review || undefined;
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.reviewedId, userId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  // 電話番号認証関連の実装
  async updatePhoneVerificationStatus(userId: number, status: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        phoneVerificationStatus: status as any, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  async verifyPhoneNumber(userId: number, phoneNumber: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        phoneNumber,
        phoneVerificationStatus: 'verified' as any,
        phoneVerificationCode: null,
        phoneVerificationExpiry: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  // 身分証明書関連の実装
  async getIdDocuments(userId: number): Promise<IdDocument[]> {
    return await db
      .select()
      .from(idDocuments)
      .where(eq(idDocuments.userId, userId));
  }

  async getIdDocument(id: number): Promise<IdDocument | undefined> {
    const [document] = await db
      .select()
      .from(idDocuments)
      .where(eq(idDocuments.id, id));
    return document || undefined;
  }

  async createIdDocument(insertIdDocument: InsertIdDocument): Promise<IdDocument> {
    const [document] = await db
      .insert(idDocuments)
      .values(insertIdDocument)
      .returning();
    return document;
  }

  async updateIdDocumentStatus(id: number, status: string, notes?: string): Promise<IdDocument | undefined> {
    const [updatedDocument] = await db
      .update(idDocuments)
      .set({ 
        verificationStatus: status as any, 
        verificationNotes: notes,
        verifiedAt: status === 'verified' ? new Date() : null
      })
      .where(eq(idDocuments.id, id))
      .returning();
    return updatedDocument || undefined;
  }

  // ガイドスケジュール関連の実装
  async getGuideSchedules(guideId: number): Promise<GuideSchedule[]> {
    return await db
      .select()
      .from(guideSchedules)
      .where(eq(guideSchedules.guideId, guideId));
  }

  async getGuideScheduleByDay(guideId: number, dayOfWeek: string): Promise<GuideSchedule | undefined> {
    const [schedule] = await db
      .select()
      .from(guideSchedules)
      .where(
        and(
          eq(guideSchedules.guideId, guideId),
          eq(guideSchedules.dayOfWeek, dayOfWeek as any)
        )
      );
    return schedule || undefined;
  }

  async createGuideSchedule(insertSchedule: InsertGuideSchedule): Promise<GuideSchedule> {
    const [schedule] = await db
      .insert(guideSchedules)
      .values(insertSchedule)
      .returning();
    return schedule;
  }

  async updateGuideSchedule(id: number, schedule: Partial<InsertGuideSchedule>): Promise<GuideSchedule | undefined> {
    const [updatedSchedule] = await db
      .update(guideSchedules)
      .set({
        ...schedule,
        updatedAt: new Date()
      })
      .where(eq(guideSchedules.id, id))
      .returning();
    return updatedSchedule || undefined;
  }

  async deleteGuideSchedule(id: number): Promise<void> {
    await db
      .delete(guideSchedules)
      .where(eq(guideSchedules.id, id));
  }

  // ガイドスケジュール例外関連の実装
  async getGuideScheduleExceptions(guideId: number): Promise<GuideScheduleException[]> {
    return await db
      .select()
      .from(guideScheduleExceptions)
      .where(eq(guideScheduleExceptions.guideId, guideId));
  }

  async getGuideScheduleExceptionsByDateRange(
    guideId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<GuideScheduleException[]> {
    // PostgreSQLのdateの範囲クエリ
    return await db
      .select()
      .from(guideScheduleExceptions)
      .where(
        and(
          eq(guideScheduleExceptions.guideId, guideId),
          // 日付範囲の条件
          // ここでは簡易的に文字列比較
          sql`${guideScheduleExceptions.exceptionDate} >= ${startDate.toISOString().split('T')[0]}`,
          sql`${guideScheduleExceptions.exceptionDate} <= ${endDate.toISOString().split('T')[0]}`
        )
      );
  }

  async createGuideScheduleException(insertException: InsertGuideScheduleException): Promise<GuideScheduleException> {
    const [exception] = await db
      .insert(guideScheduleExceptions)
      .values(insertException)
      .returning();
    return exception;
  }

  async updateGuideScheduleException(
    id: number, 
    exception: Partial<InsertGuideScheduleException>
  ): Promise<GuideScheduleException | undefined> {
    const [updatedException] = await db
      .update(guideScheduleExceptions)
      .set({
        ...exception,
        updatedAt: new Date()
      })
      .where(eq(guideScheduleExceptions.id, id))
      .returning();
    return updatedException || undefined;
  }

  async deleteGuideScheduleException(id: number): Promise<void> {
    await db
      .delete(guideScheduleExceptions)
      .where(eq(guideScheduleExceptions.id, id));
  }

  // 空き時間確認の実装
  async checkGuideAvailability(
    guideId: number, 
    date: Date, 
    startTime: string, 
    endTime: string
  ): Promise<boolean> {
    // 1. 特定の日付のスケジュール例外を確認
    const dateStr = date.toISOString().split('T')[0];
    const [exception] = await db
      .select()
      .from(guideScheduleExceptions)
      .where(
        and(
          eq(guideScheduleExceptions.guideId, guideId),
          sql`${guideScheduleExceptions.exceptionDate} = ${dateStr}`
        )
      );

    // 例外があり、利用不可の場合
    if (exception && !exception.isAvailable) {
      return false;
    }

    // 例外があり、利用可能で時間が指定されている場合、時間を確認
    if (exception && exception.isAvailable && exception.startTime && exception.endTime) {
      // 例外の時間内かどうかを確認（簡易的な実装）
      return exception.startTime <= startTime && exception.endTime >= endTime;
    }

    // 2. 例外がない場合、曜日のスケジュールを確認
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    
    const [schedule] = await db
      .select()
      .from(guideSchedules)
      .where(
        and(
          eq(guideSchedules.guideId, guideId),
          eq(guideSchedules.dayOfWeek, dayOfWeek as any)
        )
      );

    // スケジュールがない、または利用不可の場合
    if (!schedule || !schedule.isAvailable) {
      return false;
    }

    // スケジュールの時間内かどうかを確認
    return schedule.startTime <= startTime && schedule.endTime >= endTime;
  }
}



// ストレージのインスタンスをエクスポート
export const storage = new DatabaseStorage();