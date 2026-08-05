import { connectDatabase } from "../database";
import { logger } from "../logger";
import { seedAdmin, seedRoles } from "../seeders";

async function main(): Promise<void> {
    try {
        await connectDatabase();

        await seedRoles();
        await seedAdmin();

        logger.info(
            {
                module: "database",
            },
            "Database seeded successfully"
        );

        process.exit(0);
    } catch (error) {
        logger.error(
            {
                module: "database",
                err: error,
            },
            "Database seeding failed"
        );

        process.exit(1);
    }
}

main();