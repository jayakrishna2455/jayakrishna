"use server";
import { z } from "zod"
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

export async function SellYourItemAction(prevState: any, formData: FormData) {
    console.log({ prevState });
    console.log(formData.get('name'));
    console.log(formData.get('description'));
    console.log(formData.get('price'));
    console.log(formData.get('imageUrl'));
    console.log(formData.get('contactEmail'));
    console.log(formData.get('condition'));
    console.log(formData.get('location'));

    const schema = z.object({
        name: z.string().min(3),
        description: z.string().min(5),
        contactEmail: z.string().min(1).email('This is not a valid email address'),
        price: z.string().min(1),
        imageUrl: z
            .any()
            .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
            .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
                'Only .jpg, .jpeg, .png and .webp formats are supported.'
            ),
        condition: z.string().min(1),
        location: z.string().min(1),
    });
    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        contactEmail: formData.get('contactEmail'),
        price: formData.get('price'),
        imageUrl: formData.get('imageUrl'),
        condition: formData.get('condition'),
        location: formData.get('location')
    });

    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Product.',
        };
    }

    const { name, description, price, imageUrl, contactEmail, condition, location } = validatedFields.data;

    try {
        const filename = `${Math.random()}-${imageUrl.name}`
        console.log(filename)
        const supabase = createServerActionClient({ cookies })

        const { data, error } = await supabase.storage
            .from("storage")
            .upload(filename, imageUrl, {
                cacheControl: "3600",
                upsert: false
            })

        if (error) {
            return {
                type: 'error',
                message: 'Database Error: Failed to Upload Image.',
            };
        }

        console.log(data);
        if (data) {
            const path = data.path
            const { data: products, error: ErrorProduct } = await supabase
                .from("sell-products")
                .insert({ name, description, price, imageUrl: path, contactEmail, condition, location });
            console.log(products)
            if (ErrorProduct) {
                return {
                    type: "error",
                    error: "product Upload Failed"
                }
            }
        }


    } catch (error) {
        return {
            type: 'error',
            message: 'Database Error: Failed to Create Product.',
        };
    }

    revalidatePath('/')
    redirect('/')
}