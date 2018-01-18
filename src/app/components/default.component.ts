import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task';

@Component({
    selector: 'default',
    templateUrl: '../views/default.html',
    providers: [UserService, TaskService]
})

export class DefaultComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public tasks: Array<Task>;
    public status_task;
    public pages;
    public pagesPrev;
    public pagesNext;
    public loading = 'show';

    public filter = 2;
    public order = 1;
    public searchString: string;
    public totalItemsCount = 0;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _taskService: TaskService
    ) {
        this.title = 'Home Page';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.loading = 'show';
    }

    ngOnInit() {
        console.log('default.component [OK]');
        this.search();
    }

    search() {
        this.loading = 'show';
        this._route.params.forEach((params: Params) => {
            if (!this.searchString || this.searchString.trim().length == 0) {
                this.searchString = null;
            }
            let page = +params['page'];
            if (!page) {
                page = 1;
            }
            this._taskService.search(this.token, this.searchString, this.filter, this.order, page).subscribe(
                response => {
                    if (response.status == 'success') {
                        this.tasks = response.data;
                        this.totalItemsCount = response.totalItemsCount;
                        this.loading = 'hide';
                        this.pages = [];
                        for (let i = 0; i < response.totalPages; i++) {
                            this.pages.push(i);
                        }
                        if (page >= 2) {
                            this.pagesPrev = (page - 1);
                        } else {
                            this.pagesPrev = page;
                        }
                        if (page < response.totalPages || page == 1) {
                            this.pagesNext = (page + 1);
                        } else {
                            this.pagesNext = page;
                        }
                    } else {
                        this._router.navigate(['/index/1']);
                    }
                },
                error => {
                    console.log(<any> error);
                }
            );
        });
    }

    updateStatus(id: string) {
        this._route.params.forEach(() => {
            this._taskService.updateStatus(this.token, id).subscribe(
                response => {
                    this.status_task = response.status;
                    if (this.status_task != "success") {
                        this.status_task = 'error';
                    } else {
                        this.search();
                    }
                },
                error => {
                    console.log(<any> error);
                }
            );
        });
    }
}
