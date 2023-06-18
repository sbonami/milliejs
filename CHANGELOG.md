# Changelog

## 1.0.0 (2023-06-18)


### ⚠ BREAKING CHANGES

* limit Query attribute values to ease filtering
* expect Resource to be passed explicitly
* remove inactive node versions

### Features

* Add action delegation to multi-resource incremental store interface ([9021261](https://github.com/sbonami/milliejs/commit/9021261cdc518b1f15d9ed69f9460ecceb4d79db))
* Add basic multi-resource incremental store functionality ([81a222c](https://github.com/sbonami/milliejs/commit/81a222c57633c1c23b09500ca9b15bf30c90c0bd))
* Add basic process functionality ([acde7fd](https://github.com/sbonami/milliejs/commit/acde7fd03868d1ae9efdac8619f9bdd79a0e9fcc))
* Add Google PubSub store ([#88](https://github.com/sbonami/milliejs/issues/88)) ([46fdc01](https://github.com/sbonami/milliejs/commit/46fdc014244ad4a18182d9d9a6c3934ad7fde0d0)), closes [#32](https://github.com/sbonami/milliejs/issues/32)
* Add subscription pass-through ([#74](https://github.com/sbonami/milliejs/issues/74)) ([ad13056](https://github.com/sbonami/milliejs/commit/ad1305657d00ba16ddb28948d4b3ffe045480cce))
* Allow access to underlying stores ([d59ed69](https://github.com/sbonami/milliejs/commit/d59ed690d89eab2074174cbc8f2665ffdc05b0ab))
* Create base incremental store struct ([7ce70bb](https://github.com/sbonami/milliejs/commit/7ce70bb397523ca3c21fcc1a88bb0c79e6bace42))
* Create basic in-memory-store ([286cedd](https://github.com/sbonami/milliejs/commit/286ceddac18314aa0923c65eeb92afec11cb85bf))
* Create resource instance model Entity ([bd33997](https://github.com/sbonami/milliejs/commit/bd339971bb957d7729081d5dde74c3c47cb98c84))
* Create resource Query model ([a1bf5a1](https://github.com/sbonami/milliejs/commit/a1bf5a1e0e858352db401538f53c527736813069))
* Emit events in memory store ([bde5fe6](https://github.com/sbonami/milliejs/commit/bde5fe6bfb5f87f7ccdf9f251e357df7fe18037a))
* Emit store events from processed Google PubSub messages ([32fcbba](https://github.com/sbonami/milliejs/commit/32fcbbab67f3ab678001499f4f6013efe1cd138c))
* Expand node support to latest ([398bbcc](https://github.com/sbonami/milliejs/commit/398bbccae2ec2587302f3bdaabb813cd72d66a34))
* Export Lifecycle Events from MillieJS base ([adade69](https://github.com/sbonami/milliejs/commit/adade691ec54b121cf572984d13a39d6e7971a86))
* Extract asyncCallback helper into jest utils package ([ee60b81](https://github.com/sbonami/milliejs/commit/ee60b8150eb2feb6e99409ca54dc25b95f7bb149))
* Forward events through MillieJS ([b33c9c8](https://github.com/sbonami/milliejs/commit/b33c9c86cedd8ad4c8063c9440a48d007063fb94))
* Limit Query attribute values to ease filtering ([61c065a](https://github.com/sbonami/milliejs/commit/61c065a75b451b96c9853525e93539e27a7d2575))
* Manage subscriptions with client lifecycle ([d71937d](https://github.com/sbonami/milliejs/commit/d71937d21eb9fdb941f13c743276a30762004218))
* Re-export useful core resources in store base ([a97732c](https://github.com/sbonami/milliejs/commit/a97732ca6aad8c93617318263494c3cf51a33435))
* Rudimentary incremental store syncing ([1ae1c8a](https://github.com/sbonami/milliejs/commit/1ae1c8a31e2a8c1b5393209e2f53a342d76f42e5))
* Scaffold delegated publisher interface actions ([7db6c44](https://github.com/sbonami/milliejs/commit/7db6c44e1c23c80c9521e4a36e23fbeb7bb8e72b))
* Scaffold entity lifecycle events ([a11789c](https://github.com/sbonami/milliejs/commit/a11789c28184f2bf8bde615d4628251cffda1809))
* Scaffold publisher crud actions ([086c4c0](https://github.com/sbonami/milliejs/commit/086c4c0e130968ff50f8eea94b5c42d36340f028))
* Setup store linkages ([bc07c4c](https://github.com/sbonami/milliejs/commit/bc07c4c8ee01d7d66448201b21da98791a21b9b8))
* Tie Google PubSub package into store ([ddaa7e3](https://github.com/sbonami/milliejs/commit/ddaa7e34082da91313564112c2debcfb82b8baae))


### Bug Fixes

* Address constraint violations ([f132f1c](https://github.com/sbonami/milliejs/commit/f132f1ce1cdf52a0faba3529d88e587bda425b15))
* Errant package name ([aa8655f](https://github.com/sbonami/milliejs/commit/aa8655f25db7a7aada6967758ffe17c2d0669592))
* Expect Resource to be passed explicitly ([63e5d74](https://github.com/sbonami/milliejs/commit/63e5d74e75a66d5d8c0e35c6ab5d16c43d5f5a4d))
* Generate mock for each instance ([88dd2d2](https://github.com/sbonami/milliejs/commit/88dd2d20dbb16fb495efc8bbdc412591248bd3bd))
* Mock event functions for publisher ([d7483af](https://github.com/sbonami/milliejs/commit/d7483af27bfe43858e5125e13dc33b674130aa0a))
* Remove inactive node versions ([8297414](https://github.com/sbonami/milliejs/commit/82974149faa69a5823f78f83bb36e1d6e2a6b4cd))
* Set protobufjs unplugged ([e1d789b](https://github.com/sbonami/milliejs/commit/e1d789bfcff0a2af5ab1cca30d64b026686d466e))
* Specify entire version for action ([#93](https://github.com/sbonami/milliejs/issues/93)) ([faa6f82](https://github.com/sbonami/milliejs/commit/faa6f82e218870d542556770c608344aae2403e2))
