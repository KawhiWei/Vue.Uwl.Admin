<template>
    <div>
        <!-- 在这里实现递归组件，实现左侧无限级菜单 -->
        <template v-if="item.children.length>0">
            <Submenu name="2"  :key="item.path" >
                <template slot="title">
                    <span slot="title">{{item.name}}</span>
                </template>
                <!-- 在这里实现地柜组件，判断children是否为null -->
                <template v-for="child in item.children">
                    <SidebarMenu v-if="child.children!=null && child.children.length>0" :item="child" :key="child.id" />
                    <MenuItem v-else :key="child.path" :index="child.path">
                        <span>{{child.name}}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
        <template v-else>
            <MenuItem>
                <Icon type="md-home" />
                    <span>{{item.name}}</span>
            </MenuItem>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'SidebarMenu',
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        
    }
</script>