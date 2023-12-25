import { Avatar } from '@mui/material'
import avatarImg from '../../assets/avatar.jpg'

const ConversationItemComponent = () => {
    return (
        <>
            <div className="flex items-center my-7 w-full">
                <div className="mr-2">
                    <Avatar src={ avatarImg } />
                </div>
                <div className="relative font-sans w-full">
                    <h4 className='my-0 text-slate-800 font-bold'>John doe</h4>
                    <p className='my-0 text-slate-600'>Hey man how's it going are you on...</p>
                    <small className='absolute top-0 end-0'>11:55</small>
                </div>
            </div>
        </>
    )
}

export default ConversationItemComponent