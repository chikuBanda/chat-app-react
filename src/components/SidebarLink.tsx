import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Link } from "react-router-dom"

interface Props {
    title: string
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string;}
    to: string
}

const SidebarLink = ({ title, Icon, to }: Props) => {
    return (
        <>
            <div className='w-full'>
                <Link to={to} className='mx-1 mb-2 text-white flex items-center pl-7 py-2 max-w-full hover:bg-cyan-800 hover:rounded-3xl transition ease-in-out'>
                    <Icon className='mr-5' /> <span>{ title }</span>
                </Link>
            </div>
        </>
    )
}

export default SidebarLink