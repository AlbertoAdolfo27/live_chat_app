import Link from "next/link";

export const BUTTON_STYLE = {
    green: "bg-green-50 hover:bg-green-100 border-green-200",
    red: "bg-red-50 hover:bg-red-100 border-red-200",
    gray: "bg-gray-50 hover:bg-gray-100 border-gray-200"
}


type BackButtonProps = {
    buttonName?: string;
    href?: string;
    buttonStyle?: string
}

export default function BackButton({ buttonName, href, buttonStyle }: BackButtonProps) {
    if (!href) href = "/"
    if (!buttonName) buttonName = "Voltar"
    if (!buttonStyle) buttonStyle = BUTTON_STYLE.gray

    return <Link href={href} className={` rounded-md px-2 py-1 ${buttonStyle}`}>{buttonName}</Link>
}