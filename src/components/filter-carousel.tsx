"use client";

import { Badge } from "./ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface FilterCarouselProps{
    value?: string | null;
    isLoading?: boolean;
    onSelect?: (value: string) => void;
    data: {
        value: string;
        label: string;
    }[];
}

export const FilterCarousel = ({value, isLoading, onSelect, data}: FilterCarouselProps) => {
    return (
        <div className="relative w-full">
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full px-12"
            >
                <CarouselContent className="-ml-3">
                    <CarouselItem>
                        <Badge>
                            All
                        </Badge>
                    </CarouselItem>
                </CarouselContent >

            </Carousel>
        </div>
    )
}