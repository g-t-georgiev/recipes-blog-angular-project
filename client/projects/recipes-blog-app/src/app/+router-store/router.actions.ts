export {
    // dispatch at navigation start
    routerRequestAction, 
    // dispatch during navigation, before resolvers/guards run 
    routerNavigationAction,
    // dispatch after successful navigation  
    routerNavigatedAction, 
    // dispatch on navigation cancellation, e.g. when guard runs
    routerCancelAction, 
    // dispatch on error 
    routerErrorAction
} from '@ngrx/router-store';