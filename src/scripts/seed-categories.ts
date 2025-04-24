import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
    "Cars and vehicles",
    "Fashion and beauty",
    "Music and audio",
    "Games and toys",
    "Education and learning",
    "Animals",
    "Food and drinks",
    "Art and design",
    "News and politics",
    "Sports",
    "Health and fitness",
    "Technology and gadgets",
    "Home and garden",
    "Business and finance",
    "Entertainment and media",
    "Travel and tourism",
    "Electronics and appliances",
    "Other",
]

async function main(){
    console.log("Seeding categories...")
    try {
        const values = categoryNames.map((name)=>({
            name,
            description: `Videos related to ${name.toLowerCase().replace(/\s+/g, "-")}`
        }));

        await db.insert(categories).values(values);
        console.log("Categories seeded successfully!")
    } catch (error) {
        console.error("Error seeding categories:", error)
        process.exit(1)
    }
}

main();


