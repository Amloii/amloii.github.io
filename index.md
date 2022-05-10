<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/1kjTGOX.jpeg" alt="Project logo"></a>
</p>

<h1 align="center">No Faking Way</h1>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Project for detection of Fake Reviews and Spam in e-commerce
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

The Fake Reviews and the Spam are typically problems related to e-commerce platforms, such as Amazon or Yelp.

This repository validates the review across multiple filters, removing different spam cases. At this moment, the applied filters are:
- **Lang filter**: Mark the review as suspicious if it was written in another language different to Spanish, English, and french (You can modify the allowed languages in [this script](https://github.com/Amloii/NoFakingWay/blob/cc20ec70e375f67482cc96c620442fa6b0aba753/filters/Lang/Lang_filter.py)), or the words don't correspond to any language (for example, jsdfisefbijfd adifaio)
- **PII filter**: Mark the review as Spam suspicious if includes Personal Information, such as Telephone numbers or ID credentials.
- **URL filter**: Mark any review with URL as Spam.

## 🎬 Getting Started

You can use this repo installing the requeried libraries with

```
pip install -r requirements.txt
```

## 🎈 Usage <a name="usage"></a>

You can use the App created by StreamLit, with the command:

```
python streamlit run {LOCAL_FILE}/streamlit/demo_streamlit
```

Or, if you prefer, you can use the cloud app [**here**](https://share.streamlit.io/amloii/nofakingway/main/streamlit/demo_streamlit.py)


## ✍️ Authors <a name = "authors"></a>

- [@Amloii](https://github.com/Amloii/) - Idea & Initial work