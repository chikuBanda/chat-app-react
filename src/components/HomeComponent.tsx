import { Outlet } from "react-router-dom"
import HeaderComponent from "./shared/HeaderComponent";
import SideBarComponent from "./SideBarComponent";

const HomeComponent = () => {
    return (
        <>
            <div className="h-screen overflow-hidden">
                <div className="grid grid-cols-7 2xl:px-40 h-full">
                    <div className="col-span-1 h-full overflow-hidden">
                        <SideBarComponent />
                    </div>
                    <main className="col-span-6 h-full flex flex-col overflow-hidden">
                        <div className="max-w-full">
                            <HeaderComponent />
                        </div>
                        <div className="col-span-6 px-5 pt-5 overflow-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div> 
        </>
    )
}

export default HomeComponent