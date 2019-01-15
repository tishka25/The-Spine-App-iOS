/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  MainViewController.h
//  The Spine App
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "MainViewController.h"
#import "The_Spine_App-Swift.h"




//extern NSString *language;
//
@implementation MainViewController


//@synthesize currentLanguage;

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (id)init
{
    self = [super init];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

#pragma mark View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    // View defaults to full size.  If you want to customize the view's size, or its subviews (e.g. webView),
    // you can do so here.
    CGSize screenSize = [[UIScreen mainScreen] bounds].size;
    self.webView.frame = CGRectMake(0, _navigationBar.frame.origin.y + _navigationBar.frame.size.height, screenSize.width , screenSize.height - _navigationBar.frame.origin.y);
    
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleDefault];
    [self changeLanguage:ViewController.language];
    NSString *command = [NSString stringWithFormat:@"app.changeLanguage('%@')", ViewController.language];
    [self.commandDelegate evalJs:command];
    
    [super viewWillAppear:animated];
}
-(void)viewWillDisappear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.commandDelegate evalJs:@"app.saveNote(false)"];
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
}
- (IBAction)saveNote:(UIBarButtonItem *)sender {
    [self.commandDelegate evalJs:@"app.saveNote(true)"];
}

- (IBAction)backButton:(UIBarButtonItem *)sender {
    [self.commandDelegate evalJs:@"app.previousPage()"];
}

- (BOOL)webView:(WKWebView *)webView
shouldPreviewElement:(WKPreviewElementInfo *)elementInfo{
    return NO;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    self.webView.scrollView.bounces = false;
    [self changeLanguage:ViewController.language];
    NSString *command = [NSString stringWithFormat:@"app.changeLanguage('%@')", ViewController.language];
    [self.commandDelegate evalJs:command];
  
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}


-(void) changeLanguage:(NSString *)lan{
    if([lan  isEqual: @"bg"]){
        _navigationBar.topItem.title = @"Бележник";
    }else if ([lan  isEqual: @"en"]){
        _navigationBar.topItem.title = @"Notebook";
    }else if ([lan  isEqual: @"de"]){
        _navigationBar.topItem.title = @"Notizbuch";
    }else if ([lan  isEqual: @"ru"]){
        _navigationBar.topItem.title = @"Ноутбук";
    }
}

/* Comment out the block below to over-ride */

/*
- (UIWebView*) newCordovaViewWithFrame:(CGRect)bounds
{
    return[super newCordovaViewWithFrame:bounds];
}

// CB-12098
#if __IPHONE_OS_VERSION_MAX_ALLOWED < 90000  
- (NSUInteger)supportedInterfaceOrientations
#else  
- (UIInterfaceOrientationMask)supportedInterfaceOrientations
#endif
{
    return [super supportedInterfaceOrientations];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation 
{
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

- (BOOL)shouldAutorotate 
{
    return [super shouldAutorotate];
}
*/

@end

@implementation MainCommandDelegate

/* To override the methods, uncomment the line in the init function(s)
   in MainViewController.m
 */

#pragma mark CDVCommandDelegate implementation

- (id)getCommandInstance:(NSString*)className
{
    return [super getCommandInstance:className];
}

- (NSString*)pathForResource:(NSString*)resourcepath
{
    return [super pathForResource:resourcepath];
}

@end

@implementation MainCommandQueue

/* To override, uncomment the line in the init function(s)
   in MainViewController.m
 */
- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    return [super execute:command];
}

@end
