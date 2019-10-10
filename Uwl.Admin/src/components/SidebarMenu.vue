<template>
    <div>
        <!-- 在这里实现递归组件，实现左侧无限级菜单 -->
        <template v-if="item.children.length>0">
            <Submenu :name="item.id" :key="item.id" >
                <template slot="title">
                    <Icon :type="item.iconCls" />
                    {{item.name}}
                </template>
                <!-- 在这里实现地柜组件，判断children是否为null -->
                <template v-for="child in item.children">
                    <SidebarMenu v-if="child.children && child.children.length>0" 
                        :item="child" 
                        :name="child.id"
                        :key="child.id" />
                    <MenuItem v-else :key="child.id" :name="child.path">
                        {{child.name}}
                    </MenuItem>
                </template>
            </Submenu>
        </template>
        <template v-else>
            <MenuItem :name="item.path">
                <Icon :type="item.iconCls" />
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