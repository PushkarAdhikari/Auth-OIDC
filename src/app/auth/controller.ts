import type { Request, Response } from 'express';
import { signinPayloadModel, signupPayloadModel } from './models'
import { users } from '../../db/schema';
import { db } from '../../db';
import { createHmac, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { createUserToken } from './utils/token';

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const validationResult = await signupPayloadModel.safeParseAsync(req.body);
        if (validationResult.error) {
            return res.status(400).json({
                message: "body validation failed!",
                error: validationResult.error,
            })
        }

        const { firstName, lastName, email, password } = validationResult.data;

        const userEmailResult = await db.select().from(users).where(eq(users.email, email))

        if (userEmailResult.length > 0) {
            return res.status(400).json({
                message: `User with email ${email} already exists!`
            })
        }

        const salt = randomBytes(32).toString('hex');
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        const [result] = await db.insert(users).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: users.id })

        return res.status(201).json({
            message: 'User has been created successfully!',
            data: { id: result?.id }
        })
    }

    public async handleSignin(req: Request, res: Response) {
        const validationResult = await signinPayloadModel.safeParseAsync(req.body);
        if (validationResult.error) {
            return res.status(400).json({
                message: "body validation failed!",
                error: validationResult.error,
            })
        }

        const { email, password } = validationResult.data;

        const [userSelect] = await db.select().from(users).where(eq(users.email, email));
        if (!userSelect) return res.status(400).json({
            message: `User with email ${email} does not found!`
        })


        const salt = userSelect.salt!;
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        if (userSelect.password !== hash) return res.status(400).json({
            message: 'email or password is incorrect!'
        })

        //TOKEN GENERATION LOGIC SHOULD BE HERE
        const token = createUserToken({ id: userSelect.id });

        return res.json({
            message: 'User has been signed in successfully!',
            data: { token }
        })
    }

}

export default AuthenticationController;