//
//  ViewController.swift
//  The Spine App
//
//  Created by Teodor Stanishev on 5.01.19.
//

import UIKit
import WebKit
import SafariServices






class ViewController: UIViewController , WKNavigationDelegate {

    @IBOutlet weak var webView: WKWebView!
    var spinner: UIView!
    var errorView:UIView!
    var initialURL = URL(string: "https://www.thespineapp.com/");
    static var language:String = ""

    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Change the status bar color to math the web app
        self.setStatusBarBackgroundColor(color: UIColor.init(red:7/255, green:55/255, blue:99/255,alpha:1))
        
        //Start the spiner animation
        spinner = UIViewController.displaySpinner(onView: self.view)
        
        //Open the Web page
        loadWebView(url: initialURL!)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    

    func webView(_ webView: WKWebView,
                 didFinish navigation: WKNavigation!) {
        print("Loaded")
        //Send to Cordova JS what language we are using
        ViewController.language = String((webView.url?.absoluteString.suffix(2))!)
        print(ViewController.language);
//        Remove the spiner after loading the page
        UIViewController.removeSpinner(spinner: spinner)
    }
    

    //Function to check redirects and loads
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        let url = webView.url?.absoluteURL.host
        //Check whether the url is in the app (The Spine app)
        if(url != initialURL?.host){
            print("Opening browser: " , url!)
            let svc = SFSafariViewController(url: URL(string:"https://" + url!)!)
            present(svc, animated: true, completion: nil)
            webView.goBack()
        }
    }
    //
    
    //Change the Status bar apperaence
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    //
    
    override func viewWillAppear(_ animated: Bool) {
        self.setNeedsStatusBarAppearanceUpdate()
        //Check for internet connection
        if (!Reachability.isConnectedToNetwork()){
            errorView = UIViewController.displayErrorSplash(onView: self.view)
            print("No internet");
        }
        //Remove error splash
        else if (errorView != nil && Reachability.isConnectedToNetwork()){
            ViewController.removeErrorSplash(errorView: errorView)
            //Open the Web page
            loadWebView(url: initialURL!)
        }

    }
    
    
    override func viewWillDisappear(_ animated: Bool) {
    }
    
    
    //Change the status bar color
    func setStatusBarBackgroundColor(color: UIColor) {
        guard let statusBar = UIApplication.shared.value(forKeyPath: "statusBarWindow.statusBar") as? UIView else { return }
        statusBar.backgroundColor = color
    }
    //Helper function to load the WebView
    func loadWebView(url:URL){
        let myRequest = URLRequest(url: url)
        webView.navigationDelegate = self
        webView.scrollView.bounces = false;
        webView.load(myRequest)
    }
    
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    //Disable 3d touch
    func webView(_ webView: WKWebView, shouldPreviewElement elementInfo: WKPreviewElementInfo) -> Bool {
        return false
    }
    //

}


extension UIViewController {
    class func displaySpinner(onView : UIView) -> UIView {
        let image = UIImage(named: "backgroundImage.jpg");
        let imageView = UIImageView(image: image!)
        let screenSize = UIScreen.main.bounds.size;
        imageView.frame = CGRect(x: 0, y: 0, width: screenSize.width, height: screenSize.height)
        
        
        let spinnerView = UIView.init(frame: onView.bounds)
        spinnerView.backgroundColor = UIColor.init(red: 0.5, green: 0.5, blue: 0.5, alpha: 0.5)
        let ai = UIActivityIndicatorView.init(activityIndicatorStyle:  .whiteLarge)
        ai.startAnimating()
        ai.center = spinnerView.center
        
        DispatchQueue.main.async {
            spinnerView.addSubview(imageView)
            spinnerView.addSubview(ai)
            onView.addSubview(spinnerView)
        }
        
        return spinnerView
    }
    class func displayErrorSplash(onView : UIView) ->UIView{
        let errorView = UIView.init(frame: onView.bounds)
        //TODO add a refresh button
        let image = UIImage(named: "errorSplash.jpg");
        let imageView = UIImageView(image: image!)
        let screenSize = UIScreen.main.bounds.size;
        imageView.frame = CGRect(x: 0, y: 0, width: screenSize.width, height: screenSize.height)
        
        DispatchQueue.main.async {
            errorView.addSubview(imageView)
            onView.addSubview(errorView)
        }
        return errorView
    }
    class func removeErrorSplash(errorView: UIView){
        DispatchQueue.main.async {
            errorView.removeFromSuperview()
        }
    }
    
    class func removeSpinner(spinner :UIView) {
        DispatchQueue.main.async {
            spinner.removeFromSuperview()
        }
    }
}

extension ViewController : WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // Callback from javascript: window.webkit.messageHandlers.MyObserver.postMessage(message)
        let text = message.body as! String;
        let alertController = UIAlertController(title: "Javascript said:", message: text, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: .default) { (action) in
            print("OK")
        }
        alertController.addAction(okAction)
        present(alertController, animated: true, completion: nil)
    }
}

