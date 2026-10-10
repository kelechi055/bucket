import React from "react";
import { SignUp } from "@clerk/nextjs";
import Navbar from "../../../components/navbar";

export default function Page() {
    return (
        <div className="min-h-screen bg-amber-50 px-4 pt-28 pb-12">
            <Navbar />
            <main className="flex justify-center">
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            </main>
        </div>
    )
}
