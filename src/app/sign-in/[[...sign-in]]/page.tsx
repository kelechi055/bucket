import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-ceneter">
            <SignIn/>
        </div>
    )
}