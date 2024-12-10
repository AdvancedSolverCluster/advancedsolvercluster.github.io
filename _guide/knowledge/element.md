---
title: Element 软件使用
nav_order: 7
parent: 其他知识
---

# Introduction

Created: *September 5, 2022, [Xiang Li](mailto:646873166@qq.com)*



Element is a decentralized, encrypted chat & collaboration app designed for secure and independent communication.

It provides

- self-hosted server capability. Our team keeps all the data on our servers.
- end-to-end encryption capability. Data are kept personal and confidential on our servers.
- cross-signed device verification capability. You can log in with multiple devices simultaneously.
- coder-friendly markdown syntax support. Use markdown & part of the LaTeX grammar and communicate more professionally.
- open-source code.

It's powered by an open network framework [Matrix](https://matrix.org). You won't feel surprised seeing this term or be confused with the concept of the matrix in Math.

# Important Features of Element


{: .important }
> Element is **end-to-end encrypted**. Theoretically everything is stored encrypted at the server. Every time you re-login to the app (creating a new session), all previous messages **cannot** be accessed again, unless
> 
> - Your old key is backed up manually and thus restored the key manually
> - You have allowed auto key backup. Encrypted key is backed up at the server and they will be loaded to new clients automatically.
> - Your old client is still active (say, on another machine). You can allow cross-signing to synchronize known keys. 
>
> Usually, you should manually backup your keys at least at the first login. More options can be found in the "Security" tab in the settings.


# Download and Start Using Element

1. Go to [element.io](https://element.io/download) and download your apps. You might occasionally use our self-hosted [Element Web: https://element.advancedsolver.com](https://element.advancedsolver.com) on infrequently used machines. It's OK. For a better experience, we suggest you download the apps.
2. **If you are on Windows and just downloaded the app, before your first login on this device, you'll need to set up a configuration file.** Copy the file content attached at the end of this page, to your Element installation directory. Usually, the installation is at `C:\Users\YOUR_USER_NAME\AppData\Roaming\Element\` for Windows. Create or edit `config.json` there. Always re-open your app after editing this config file.
3. Either for the [Element Web](https://element.advancedsolver.com) or the app, click `Sign in`. You shall be asked to provide a `Homeserver`, a username and a password. **Check the `Homeserver` is indeed `matrix.advancedsolver.com`, our self-hosted server.** 
  Then you may sign in or sign up with your credentials.
    - If you are about to sign up,
      - you might need to contact the administrator in case you haven't been authorized to create an account.
      - A security key will be generated. Ensure it **is safely stored** as it's **the last resort** to restore your chat history if your password is lost. It serves as the master key to retrieve your encrypted data.
    - If you are about to sign in from a new device, you will be asked to do a cross-device verification.
      - Use another device with Element logged in, or your security key to verify this new device.
      - Without verification, you won't be able to access chat history, and an unverified mark will appear on your newly sent messages.
4. After logging in, you may wish to customize settings to enable using LaTeX and other features.
    - Go to `Settings` and tune the following:
    - Go to `Labs` and check if `Render LaTeX maths in messages` and `Message Pinning` are checked. This is enforced via the config.
5. Congratulations! You are almost ready to use Element to power up your communication workflow. Contact our [administrator team](mailto:cash_admin@163.com) if you have any further questions.

## Appendix: `config.json`

**🦖 Deprecation notice to existing users :**

Configuration keys were previously a mix of `camelCase` and `snake_case`. Element standardised to `snake_case` but maintained partial compatibility for `camelCase` to several settings. This backwards compatibility will be getting removed in a future release so please ensure you are updating your previous `camelCase` settings to `snake_case`.

Example: `roomDirectory` -> `room_directory`, `showLabsSettings` -> `show_labs_settings`


The place for this file is under your Element installation, which would be 

- `C:\Users\$YOUR_USER_NAME\AppData\Roaming\Element\` by default on Windows.
- `$XDG_CONFIG_HOME/$NAME/config.json or ~/.config/$NAME/config.json` on Linux
- `~/Library/Application Support/$NAME/config.json` on macOS

(Linux/macOS are not verified yet)

In the paths above, `$NAME` is typically `Element`.

A sample config is provided below.

If there is already a `config.json` file, you should open and edit it carefully.

**If the syntax should have any error, the config will not be effective.** You will see "Advancedsolver Guide" at the bottom of the login page if the config is active.

```json
{
    "update_base_url": "https://packages.element.io/desktop/update/",
    "default_server_name": "matrix.advancedsolver.com",
    "brand": "Element",
    "branding": {
        "auth_footer_links": [
            {"text": "AdvancedSolver Guide", "url": "https://advancedsolver.com/guide/"}
         ]
    },
    "integrations_ui_url": "https://scalar.vector.im/",
    "integrations_rest_url": "https://scalar.vector.im/api",
    "integrations_widgets_urls": [
        "https://scalar.vector.im/_matrix/integrations/v1",
        "https://scalar.vector.im/api",
        "https://scalar-staging.vector.im/_matrix/integrations/v1",
        "https://scalar-staging.vector.im/api",
        "https://scalar-staging.riot.im/scalar/api"
    ],
    "hosting_signup_link": "",
    "bug_report_endpoint_url": "",
    "room_directory": {
        "servers": [
            "matrix.advancedsolver.com"
        ]
    },
    "show_labs_settings": true,
    "features": {
            "feature_latex_maths": true,
            "feature_pinning": true,
            "feature_jump_to_date": true,
            "feature_dehydration": true,
            "feature_html_topic": true
    },
    "enable_presence_by_hs_url": {
        "https://matrix.advancedsolver.com": true
    }
}
```
