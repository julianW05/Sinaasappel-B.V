import { useEffect, useState } from "react";

export default function Succes_popup(onderwerp) {
    
    useEffect(() => {
    }, [])

    return (
        <div className="succes_popup row">
            <h1>{onderwerp} Aangemaakt!</h1>
        </div>
    )
}