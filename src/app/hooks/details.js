import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";


import {useUser} from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export const useDetails = () => {
  const clerkUser = useUser();
  const [bucketItems, setBucketItems] = useState([]);
  const[error, setError] = useState(null);

      const db = firebase.firestore();

      useEffect(() => {
        const retrieveDetails = async function(){
            try{
                const firebaseToken = await clerkUser.getToken("firebase");
                await firebase.auth().signInWithCustomToken(firebaseToken);
            
            const tempDetails = [];
            const example = await db.collection("BucketList").get();
            examplee.forEach((detail) => {
                tempDetails.push(detail.data());
    })
    setBucketItems(tempDetails);
} catch(err){
    setError(err)
}
        }
        retrieveDetails();
    }, []);
    return { bucketItems, error,
        
     };
      


    }