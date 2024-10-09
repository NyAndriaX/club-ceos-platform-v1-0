import React, { PropsWithChildren, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface MemberPageProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: string | ReactNode;
    subtitle?: string | ReactNode;
    headerClassName?: string;
    header?: string | ReactNode;
}

export const MemberPage: React.FC<PropsWithChildren<MemberPageProps>> = ({
    title,
    subtitle,
    children,
    className,
    header,
    headerClassName,
    ...props
}) => {
    const pathname = usePathname();
    return (
        <div
            className={`flex flex-row justify-center p-8 mx-auto min-h-[70vh] ${pathname !== "/member/home"
                ? `ml-28 max-w-[93.35%]`
                : "ml-72 max-w-[82.8%]"
                }  h-full items-start w-full overflow-auto`}
            {...props}
        >
            <div
                className={`flex flex-col gap-4 rounded-md ${className ? className : "w-full"
                    }`}
            >
                {header && (
                    <div
                        className={`flex flex-row gap-2 items-start w-full sticky -top-8 p-4 rounded-md border-b border-gray-100 z-30 ${headerClassName}`}
                    >
                        {header}
                    </div>
                )}

                {title && (
                    <h1 className="text-lg md:text-2xl font-bold w-full">{title}</h1>
                )}
                <div
                    className={`flex flex-col gap-4 max-h-full overflow-auto w-full `}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
