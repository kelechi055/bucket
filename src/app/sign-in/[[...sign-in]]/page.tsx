import React from "react";
import { SignIn } from "@clerk/nextjs";
import Navbar from "../../../components/navbar";

export default function Page() {
    return (
        <div className="min-h-screen bg-amber-50 px-4 pt-28 pb-12">
            <Navbar />
            <main className="flex justify-center">
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
            </main>
        </div>
    )
}
