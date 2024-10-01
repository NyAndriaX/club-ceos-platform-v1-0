import React, { PropsWithChildren, ReactNode } from "react";


interface MemberPageProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: string | ReactNode;
    subtitle?: string | ReactNode;
}

export const MemberPage: React.FC<PropsWithChildren<MemberPageProps>> = ({
    title,
    subtitle,
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={`flex flex-col mx-auto gap-4 lg:px-8 lg:py-4 h-full items-start  ${className ?? "w-full"
                }`}
            {...props}
        >
            <div className="flex flex-col gap-2 items-start">
                <h1 className="text-lg md:text-2xl font-bold w-full">{title}</h1>
                {subtitle && (
                    <p className="text-base font-light text-gray-500 w-2/3">{subtitle}</p>
                )}
            </div>
            <div className="flex flex-col gap-4 mt-4 max-h-full overflow-auto w-full">
                {children}
            </div>
        </div>
    );
};
