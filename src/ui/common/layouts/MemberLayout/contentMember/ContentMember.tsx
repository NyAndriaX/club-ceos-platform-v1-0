import { ComponentMember } from "@/ui/common/components/layout/MemberLayout/contentMember/ComponentMember";


type Props = {
    children: React.ReactNode;
};

export const ContentMember = ({ children }: Props) => {
    return (
        <div className="w-full h-screen flex flex-col">
            <ComponentMember>{children}</ComponentMember>
        </div>
    );
};