import { connectDb, disconnectDb, getDb } from "./connection";
import { users, workspaces, hypotheses, experiments, documents } from "./schema";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });

async function seed() {
  console.log("🌱 Seeding database...");
  
  try {
    await connectDb();
    const db = getDb();
    
    // Check if data already exists
    const existingWorkspaces = await db.select().from(workspaces).limit(1);
    if (existingWorkspaces.length > 0) {
      console.log("⚠️ Database already contains data. Skipping seed.");
      return;
    }
    
    // Create sample workspace
    const [demoWorkspace] = await db.insert(workspaces).values({
      name: "Demo Workspace",
      slug: "demo-workspace",
    }).returning();
    
    if (!demoWorkspace) {
      throw new Error("Failed to create demo workspace");
    }
    
    console.log("✅ Created demo workspace");
    
    // Create sample user
    const [demoUser] = await db.insert(users).values({
      clerkId: "demo_user_clerk_id",
      email: "demo@pmtools.example.com",
      firstName: "Demo",
      lastName: "User",
      workspaceId: demoWorkspace.id,
      role: "admin",
    }).returning();
    
    if (!demoUser) {
      throw new Error("Failed to create demo user");
    }
    
    console.log("✅ Created demo user");
    
    // Create sample hypothesis
    const [sampleHypothesis] = await db.insert(hypotheses).values({
      userId: demoUser.id,
      workspaceId: demoWorkspace.id,
      intervention: "Add a progress bar to the checkout flow",
      targetAudience: "Mobile users in the US market",
      expectedOutcome: "Increase checkout conversion rate by 5%",
      reasoning: "User research shows that 67% of users abandon checkout due to uncertainty about remaining steps",
      successMetrics: ["checkout_conversion_rate", "cart_abandonment_rate", "time_to_complete_checkout"],
      status: "approved",
    }).returning();
    
    if (!sampleHypothesis) {
      throw new Error("Failed to create sample hypothesis");
    }
    
    console.log("✅ Created sample hypothesis");
    
    // Create sample experiment
    const [sampleExperiment] = await db.insert(experiments).values({
      hypothesisId: sampleHypothesis.id,
      workspaceId: demoWorkspace.id,
      name: "Checkout Progress Bar A/B Test",
      description: "Testing the impact of adding a progress bar to the mobile checkout flow",
      sampleSize: 50000,
      confidenceLevel: 95,
      statisticalPower: 80,
      variants: [
        { name: "control", allocation: 50, description: "Current checkout without progress bar" },
        { name: "treatment", allocation: 50, description: "Checkout with new progress bar" }
      ],
      status: "planning",
    }).returning();
    
    if (!sampleExperiment) {
      throw new Error("Failed to create sample experiment");
    }
    
    console.log("✅ Created sample experiment");
    
    // Create sample documents
    await db.insert(documents).values([
      {
        experimentId: sampleExperiment.id,
        workspaceId: demoWorkspace.id,
        type: "prd",
        title: "Checkout Progress Bar PRD",
        content: `# Checkout Progress Bar Feature

## Overview
This document outlines the implementation of a progress bar for the mobile checkout flow.

## Problem Statement
Users are abandoning checkout at a rate of 23% on mobile devices...

## Solution
Implement a visual progress indicator showing checkout steps...`,
        format: "markdown",
        createdBy: demoUser.id,
      },
      {
        experimentId: sampleExperiment.id,
        workspaceId: demoWorkspace.id,
        type: "test_plan",
        title: "Progress Bar A/B Test Plan",
        content: `# A/B Test Plan: Checkout Progress Bar

## Test Overview
- **Hypothesis**: Adding a progress bar will reduce checkout abandonment
- **Sample Size**: 50,000 users (25,000 per variant)
- **Duration**: Estimated 10 days

## Success Metrics
- Primary: Checkout conversion rate
- Secondary: Cart abandonment rate
- Guardrail: Page load time`,
        format: "markdown",
        createdBy: demoUser.id,
      }
    ]);
    
    console.log("✅ Created sample documents");
    
    console.log("\n✅ Seeding completed successfully!");
    console.log("\n📊 Seed Summary:");
    console.log("- 1 Workspace created");
    console.log("- 1 User created");
    console.log("- 1 Hypothesis created");
    console.log("- 1 Experiment created");
    console.log("- 2 Documents created");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await disconnectDb();
  }
}

// Run seed if this file is executed directly
if (import.meta.main) {
  seed();
}

export { seed };