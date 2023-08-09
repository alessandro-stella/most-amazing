import bcrypt from "bcrypt";

const saltRounds = 12;

export default async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => hash);

    return hashedPassword;
}
