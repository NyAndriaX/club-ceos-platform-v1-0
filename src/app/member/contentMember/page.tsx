import { ContentMember } from "@/ui/common/layouts/MemberLayout/contentMember/ContentMember";



type Props = {
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <ContentMember>{children}</ContentMember>
        </div>
    );
};

export default Layout;