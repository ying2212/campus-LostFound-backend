import bcrypt from "bcrypt"

export async function hashpassword(password){
    //The amount of times the password is rehased
    const saltRounds = 10;

    return await bcrypt.hash(password,saltRounds);
}

export async function comparePassword(password, hashPassword) {
    //compares inputted password with the hashpoasword in the DB
    return await bcrypt.compare(password, hashPassword)
}