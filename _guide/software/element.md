---
title: Element
parent: 软件教程
nav_order: 1
---

# Using Element

*September 5, 2022, [Xiang Li](mailto:646873166@qq.com)*

Element is a decentralized, encrypted chat & collaboration app designed for secure and independent communication.

It provides

- self-hosted server capability. Our team keeps all the data on our servers.
- end-to-end encryption capability. Data are kept personal and confidential on our servers.
- cross-signed device verification capability. You can log in with multiple devices simultaneously.
- coder-friendly markdown syntax support. Use markdown & part of the LaTeX grammar and communicate more professionally.
- open-source code.

It's powered by an open network framework [Matrix](https://matrix.org). You won't feel surprised seeing this term or be confused with the concept of the matrix in Math.

## Download and Start Using Element

1. Go to [element.io](https://element.io/get-started) and download your apps. You might occasionally use [Element Web](https://element.advancedsolver.com) on infrequently used machines. It's OK. For a better experience, we suggest you download the apps.
2. **If you are on Windows and just downloaded the app, before your first login on this device, you'll need to set up a configuration file.** Copy the file content attached at the end of this page, to your Element installation directory. Usually, the installation is at `C:\Users\YOUR_USER_NAME\AppData\Roaming\Element\` for Windows. Create or edit `config.json` there.
3. Either for the [Element Web](https://element.advancedsolver.com) or the app, click `Sign in`. You shall be asked to provide a `Homeserver`, a username and a password. **Change the `Homeserver` to `matrix.advancedsolver.com`, our self-hosted server.** Then you may sign in or sign up with your credentials.
    - If you are about to sign up,
      - you might need to contact the administrator in case you haven't been authorized to create an account.
      - A security key will be generated. Ensure it **is safely stored** as it's **the last resort** to restore your chat history if your password is lost. It serves as the master key to retrieve your encrypted data.
    - If you are about to sign in from a new device, you will be asked to do a cross-device verification.
      - Use another device with Element logged in, or your security key to verify this new device.
      - Without verification, you won't be able to access chat history, and an unverified mark will appear on your newly sent messages.
4. After logging in, you may wish to customize settings to enable using LaTeX and other features.
    - Go to `Settings` and tune the following:
    - Go to `Labs` and `join the beta` for `Threads` (or `Threaded messaging`). This allows you replying messages in separate threads, keeping the channels well-organized.
    - Go to `Labs` and check if `Render LaTeX maths in messages` and `Message Pinning` are checked. Some editions of the app might not support these features.
5. Congratulations! You are almost ready to use Element to power up your communication workflow. Contact our [administrator team](mailto:cash_admin@163.com) if you have any further questions.

## Appendix: `config.json`

**Deprecated Warning:** A recent update in Element may have made this script invalid on newer versions. We are working on providing compatible scripts. You should not use this script and leave the config in its default state for now.

The place for this file is under your Element installation, which would be `C:\Users\YOUR_USER_NAME\AppData\Roaming\Element\` by default on Windows.
A sample config is provided below.

~~~ json
{
    "update_base_url": "https://packages.element.io/desktop/update/",
    "default_server_name": "matrix.advancedsolver.com",
    "brand": "Element",
    "branding": {
        "auth_footer_links": [
            {"text": "FAQ", "url": "https://advancedsolver.com/guide/"}
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
    "roomDirectory": {
        "servers": [
            "matrix.advancedsolver.com"
        ]
    },
    "showLabsSettings": true,
    "features": {
            "feature_latex_maths": true,
            "feature_pinning": true,
            "feature_thread": true,
            "feature_polls": true,
            "feature_hidden_read_receipts": true,
            "feature_dnd": true,
            "feature_presence_in_room_list": true,
            "feature_custom_status": true,
            "feature_state_counters": true,
            "feature_voice_messages": true
    },
    "enable_presence_by_hs_url": {
        "https://matrix.advancedsolver.com": true
    }
}
~~~
