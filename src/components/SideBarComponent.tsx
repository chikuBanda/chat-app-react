import './Sidebar.css'
import ViteImg from '../assets/img/react.svg'
import { Dashboard, Chat } from '@mui/icons-material'
import SidebarLink from './SidebarLink'

const SideBarComponent = () => {
    return (
        <>
            <div className='h-full bg-cyan-950'>
                <div className='pt-7 pl-7'>
                    <img src={ViteImg} alt="" width={ '50' } />
                </div>

                <div className='mt-5 font-sans w-full'>
                    <SidebarLink title='Dashboard' to='/app' Icon={ Dashboard } />

                    <SidebarLink title='Messaging' to='/app/chat' Icon={ Chat } />
                </div>

            </div>
        </>
    )
}

export default SideBarComponent