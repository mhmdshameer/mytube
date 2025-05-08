import {  useEffect, useRef, useState } from "react";

export const userIntersectioObserver = (options?: IntersectionObserverInit)=> {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLElement>(null);

    useEffect(()=>{
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if(targetRef.current){
            observer.observe(targetRef.current);
        }

        return () => observer.disconnect();
    },[options]);

    return {targetRef, isIntersecting}
}