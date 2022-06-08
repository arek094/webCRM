import { Component, OnInit } from "@angular/core";
import {Router,Event,ActivationStart,ActivatedRouteSnapshot,ActivationEnd,NavigationEnd,NavigationStart} from "@angular/router";
import { filter, map, buffer, pluck } from "rxjs/operators";

/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent implements OnInit {
  bcLoadedData;
  bcForDisplay;

  constructor(private router: Router) {}

  ngOnInit() {
  }
}