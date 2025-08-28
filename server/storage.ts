import {
  users,
  sponsorStores,
  tourismGuides,
  experiencePrograms,
  reservations,
  reviews,
  type User,
  type UpsertUser,
  type SponsorStore,
  type InsertSponsorStore,
  type TourismGuide,
  type InsertTourismGuide,
  type ExperienceProgram,
  type InsertExperienceProgram,
  type Reservation,
  type InsertReservation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Sponsor Store operations
  createSponsorStore(store: InsertSponsorStore): Promise<SponsorStore>;
  getSponsorStoreByEmail(email: string): Promise<SponsorStore | undefined>;
  getSponsorStoreById(id: string): Promise<SponsorStore | undefined>;
  updateSponsorStore(id: string, updates: Partial<InsertSponsorStore>): Promise<SponsorStore>;
  getAllSponsorStores(): Promise<SponsorStore[]>;
  
  // Tourism Guide operations
  createTourismGuide(guide: InsertTourismGuide): Promise<TourismGuide>;
  getTourismGuidesByStore(storeId: string): Promise<TourismGuide[]>;
  getTourismGuideById(id: string): Promise<TourismGuide | undefined>;
  updateTourismGuide(id: string, updates: Partial<InsertTourismGuide>): Promise<TourismGuide>;
  
  // Experience Program operations
  createExperienceProgram(program: InsertExperienceProgram): Promise<ExperienceProgram>;
  getExperienceProgramsByStore(storeId: string): Promise<ExperienceProgram[]>;
  
  // Reservation operations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservationsByStore(storeId: string): Promise<Reservation[]>;
  updateReservationStatus(id: string, status: string): Promise<Reservation>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Sponsor Store operations
  async createSponsorStore(store: InsertSponsorStore): Promise<SponsorStore> {
    const [newStore] = await db
      .insert(sponsorStores)
      .values(store)
      .returning();
    return newStore;
  }

  async getSponsorStoreByEmail(email: string): Promise<SponsorStore | undefined> {
    const [store] = await db
      .select()
      .from(sponsorStores)
      .where(eq(sponsorStores.email, email));
    return store;
  }

  async getSponsorStoreById(id: string): Promise<SponsorStore | undefined> {
    const [store] = await db
      .select()
      .from(sponsorStores)
      .where(eq(sponsorStores.id, id));
    return store;
  }

  async updateSponsorStore(id: string, updates: Partial<InsertSponsorStore>): Promise<SponsorStore> {
    const [store] = await db
      .update(sponsorStores)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(sponsorStores.id, id))
      .returning();
    return store;
  }

  async getAllSponsorStores(): Promise<SponsorStore[]> {
    return await db
      .select()
      .from(sponsorStores)
      .where(eq(sponsorStores.isActive, true))
      .orderBy(desc(sponsorStores.createdAt));
  }

  // Tourism Guide operations
  async createTourismGuide(guide: InsertTourismGuide): Promise<TourismGuide> {
    const [newGuide] = await db
      .insert(tourismGuides)
      .values(guide)
      .returning();
    return newGuide;
  }

  async getTourismGuidesByStore(storeId: string): Promise<TourismGuide[]> {
    return await db
      .select()
      .from(tourismGuides)
      .where(and(
        eq(tourismGuides.storeId, storeId),
        eq(tourismGuides.isAvailable, true)
      ))
      .orderBy(desc(tourismGuides.createdAt));
  }

  async getTourismGuideById(id: string): Promise<TourismGuide | undefined> {
    const [guide] = await db
      .select()
      .from(tourismGuides)
      .where(eq(tourismGuides.id, id));
    return guide;
  }

  async updateTourismGuide(id: string, updates: Partial<InsertTourismGuide>): Promise<TourismGuide> {
    const [guide] = await db
      .update(tourismGuides)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tourismGuides.id, id))
      .returning();
    return guide;
  }

  // Experience Program operations
  async createExperienceProgram(program: InsertExperienceProgram): Promise<ExperienceProgram> {
    const [newProgram] = await db
      .insert(experiencePrograms)
      .values(program)
      .returning();
    return newProgram;
  }

  async getExperienceProgramsByStore(storeId: string): Promise<ExperienceProgram[]> {
    return await db
      .select()
      .from(experiencePrograms)
      .where(and(
        eq(experiencePrograms.storeId, storeId),
        eq(experiencePrograms.isActive, true)
      ))
      .orderBy(desc(experiencePrograms.createdAt));
  }

  // Reservation operations
  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const [newReservation] = await db
      .insert(reservations)
      .values(reservation)
      .returning();
    return newReservation;
  }

  async getReservationsByStore(storeId: string): Promise<Reservation[]> {
    return await db
      .select()
      .from(reservations)
      .where(eq(reservations.storeId, storeId))
      .orderBy(desc(reservations.createdAt));
  }

  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    const [reservation] = await db
      .update(reservations)
      .set({ status, updatedAt: new Date() })
      .where(eq(reservations.id, id))
      .returning();
    return reservation;
  }
}

export const storage = new DatabaseStorage();