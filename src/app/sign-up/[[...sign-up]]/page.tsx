import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-ceneter">
            <SignUp/>
        </div>
    )
}