import { Drawer, type Props as DrawerProps } from "@repo/drawer"

export const ThemeDrawer = (props: DrawerProps) => {
    return (
        <Drawer
            className="sm:max-w-sm"
            description="自定义主题设置 & 实时预览"
            title="主题设置"
            {...props}
        >
            <div className="p-1">
                {props.children}
            </div>
        </Drawer>
    )
}