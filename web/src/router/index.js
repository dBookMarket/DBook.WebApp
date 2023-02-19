import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import Index from "../views/Index.vue"
import AuthorCenter from "../views/AuthorCenter.vue"
import IssueInfo from "../views/IssueInfo.vue"
import DraftEdit from "../views/DraftEdit.vue"
import PublishBook from "../views/PublishBook.vue"
import ShangJia from "../views/ShangJia.vue"
import Concern from "../views/Concern.vue"
import MyCollection from "../views/MyCollection.vue"
import PeosonSettings from "../views/PersonSettings.vue"
import WritePublishManagement from "../views/WritePublishManagement.vue"
const router = createRouter({
    routes: [
        {
            path: '/',
            component: Index
        },
        {
            path: '/index',
            component: Index
        },
        {
            path: '/authorCenter/:id',
            component: AuthorCenter
        },
        {
            path: '/issueInfo/:id/:type',
            component: IssueInfo
        },
        {
            path: '/draftEdit/:id',
            component: DraftEdit
        },
        {
            path: '/publishBook/:id/:isDraft',
            component: PublishBook
        },
        {
            path: '/shangjia/:issueId/:bookId',
            component: ShangJia
        },
        {
            path: '/concern',
            component: Concern
        },
        {
            path: '/mycollection',
            component: MyCollection
        },
        {
            path: '/personSettings',
            component: PeosonSettings
        },
        {
            path: '/writePublishManagement/:type',
            component: WritePublishManagement
        },
    ],
    history: createWebHistory(), //history模式使用HTML5模式
});

export default router;