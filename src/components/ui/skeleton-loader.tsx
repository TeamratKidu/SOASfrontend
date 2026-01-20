
import React from 'react';
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    );
}

interface SkeletonLoaderProps {
    count?: number;
    type?: 'card' | 'row' | 'text';
    className?: string;
}

export function SkeletonLoader({ count = 3, type = 'row', className }: SkeletonLoaderProps) {
    return (
        <div className={cn("w-full space-y-4", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-full">
                    {type === 'text' && (
                        <Skeleton className="h-4 w-full" />
                    )}
                    {type === 'row' && (
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    )}
                    {type === 'card' && (
                        <div className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
