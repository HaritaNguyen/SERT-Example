import { db } from "../lib/prisma";

export default async function generateUniqueUsername(): Promise<string> {
    const base = "username";
    let isUsernameTaken = true;
    let finalUsername = "";

    while (isUsernameTaken) {
        const randomSuffix = String(Math.floor(Math.random() * 0x1000000));
        finalUsername = `${base}${randomSuffix}`

        const user = await db.user.findUnique({
            where : {
                username : finalUsername
            }
        })

        if (!user) {
            isUsernameTaken = false
        }
    }

    return finalUsername;
}