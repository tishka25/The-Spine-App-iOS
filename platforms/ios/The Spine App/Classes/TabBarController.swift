//
//  TabBarController.swift
//  The Spine App
//
//  Created by Teodor Stanishev on 6.01.19.
//

import UIKit

class TabBarController: UITabBarController, UITabBarControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        self.delegate = self

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // called whenever a tab button is tapped
    func tabBarController(_ tabBarController: UITabBarController, didSelect viewController: UIViewController) {
        if viewController is ViewController {
            setStatusBarBackgroundColor(color: UIColor.init(red:7/255, green:55/255, blue:99/255,alpha:1))
            self.navigationController?.navigationBar.barStyle = UIBarStyle.default
        } else if viewController is NotebookViewController {
            setStatusBarBackgroundColor(color: UIColor.init(red:1, green:1, blue:1,alpha:1))
            self.navigationController?.navigationBar.barStyle = UIBarStyle.black
        }
    }
    
    
    func setStatusBarBackgroundColor(color: UIColor) {
        
        guard let statusBar = UIApplication.shared.value(forKeyPath: "statusBarWindow.statusBar") as? UIView else { return }
        
        statusBar.backgroundColor = color
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
