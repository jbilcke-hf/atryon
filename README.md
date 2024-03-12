# Atryon

Atryon ("a-try-on") is a free Chrome extension to try any clothes you see online on a picture of yourself.

## Why using Atryon is better than a built-in try on widget that some websites have

### Compatible with all platforms

A lot of e-commerce websites are a bit late when it comes to using AI technologies,
and only a few are willing to develop or purchase a virtual try-on solution for their websites.

With Atryon this becomes a non-issue: regardless of the technology used by each shopping website,
images will be replaced by a picture of yourself, all automatically.

### Configure once, run everywhere

With Atryon, you do not need to setup a virtual 3D avatar, send your picture to 
each of the e-commerce website your visit.

Instead you do the setup once, and it "just works".

### Privacy first

It can be a bit nerve wrecking to send your picture to a dozen of shopping platforms,
you never know what they will do with it.

With Atryon, you only need to send your picture to one provider.
And the best thing? You get to choose which one, you can even run it locally if you want!

By default we provide an access to Hugging Face, which preserves your privacy 
(images are not stored or logged).

## Instructions for developers

### run

1. run docker

`docker compose up -d --build`

2. Turn on developer mode in the Chrome [Extension page](chrome://extensions/) and load dist file

#### restart

`docker restart extension`

#### logs

`docker logs extension -f`

#### stop

`docker stop extension`

#### background(service-worker) development

Clicking on service worker link in [chrome://extensions/](chrome://extensions/) launches the developer tool

### build

#### Access within docker environment

`docker compose exec extension ash`

#### Run build command

`/usr/src/app # yarn build`

### Deploying the backend

#### Note about billing

Running the try-on API can be expensive if you do too many requests,
or leave the server on for too long.

Regardless of the provider, please verify your payment capacity and only spend what you can afford.

#### Deploy to Hugging Face

First install [grog](https://github.com/multimodalart/grog), then follow grog's README.md instructions:

```
python grog.py --replicate_model_id viktorfa/oot_diffusion --run_type huggingface_spaces --huggingface_token YOUR_OWN_HUGGINGFACE_TOKEN --space_hardware t4-medium
```

Be careful of costs. You are strongly recommend to stop the server once you do not use it anymore.

#### Deploy to Replicate

There is already a Replicate model deployed at [viktorfa/oot_diffusion](https://replicate.com/viktorfa/oot_diffusion). Follow Replicate's instructions if you want your own "always-on" server.
