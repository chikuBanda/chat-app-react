import { MoreHoriz, Send } from "@mui/icons-material"
import avatarImg from '../../assets/avatar.jpg'
import { Avatar, Button } from "@mui/material"
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const MessageWindowComponent = () => {
    return (
        <>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center mx-8 pb-2 border-solid border-0 border-b border-slate-500">
                    <div className="mr-2">
                        <Avatar sx={{ width: 50, height: 50 }} src={avatarImg} />
                    </div>
                    <div className="relative font-sans w-full">
                        <h3 className='my-0 text-slate-800 font-bold'>Sibo</h3>
                        <p className='my-0 text-slate-600'>
                            <span className='w-2 h-2 rounded-full bg-green-500 inline-block mr-2'></span>
                            online
                        </p>
                        <button className='absolute top-4 end-0 border-none bg-transparent text-slate-600 text-xl cursor-pointer'><MoreHoriz /></button>
                    </div>
                </div>

                <div className="mx-8 h-full overflow-auto bg-sky-100 p-4">
                    <div className="flex pt-5">
                        <div className="mr-2">
                            <Avatar className="shadow" sx={{ width: 30, height: 30 }} src={avatarImg} />
                        </div>
                        <div className="bg-slate-200 p-2 rounded-lg rounded-tl-none shadow" style={{ width: 'fit-content' }}>
                            This is a chat bubble
                            This is a chat bubble
                            This is a chat bubble
                        </div>
                    </div>

                    <div className="flex pt-5 justify-end">
                        <div className="bg-slate-200 p-2 rounded-lg rounded-tr-none shadow" style={{ width: 'fit-content' }}>
                            This is a chat bubble
                            This is a chat bubble
                            This is a chat bubble
                        </div>
                        <div className="ml-2">
                            <Avatar className="shadow" sx={{ width: 30, height: 30 }} src={avatarImg} />
                        </div>
                    </div>
                </div>

                <div className="mx-8 py-4 px-2 bg-sky-100">
                    <div className="flex items-centerpy-2 px-2 py-3 bg-white rounded-lg shadow">
                        <TextareaAutosize placeholder="Type a message..." className="w-full p-2 border-none focus:border-none focus:outline-none focus:ring-0 resize-none" />
                        <Button className="bg-sky-500 text-white rounded-full" variant="contained" size="small" type="submit">
                            <Send sx={{ fontSize: 16 }} className="text-white" style={{ transform: 'rotate(315deg)' }} />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageWindowComponent