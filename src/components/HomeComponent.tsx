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
                    <main className="col-span-6 h-full relative">
                        <div className="absolute top-0 left-0 w-full">
                            <HeaderComponent />
                        </div>
                        <div className="col-span-6 overflow-auto max-h-screen">
                            <div className="px-5 pt-20">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div> 
        </>
    )
}

export default HomeComponent