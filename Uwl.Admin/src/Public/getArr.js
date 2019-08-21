
export default {
    //根据路由获取到菜单id
    getBtnArr:function(route) {
        var routemo=route.path;
        var routerarr= JSON.parse(window.localStorage.getItem('router'));
        var rows;
        function getBtn(routerarr) {
            routerarr.forEach(element => {
                if(element.path==routemo)
                {
                    rows=element;
                }
                else
                {
                    var arr=element.children;
                    if(arr.length>0)
                    {
                        getBtn(arr);
                    }
                }
            }); 
        }
        getBtn(routerarr);
        return rows;
    },
}