var MusicPlayer = function(musicUrl, audioObj, titleArea) {
    this.musicUrl = musicUrl;
    this.audioObj = audioObj;
    this.titleArea = titleArea;

    this.currentMusicName = '';
    this.ext = '';

    var o = this;

    // 一曲の再生が終わったとき、次の曲を読み込む
    this.audioObj.bind("ended", function() {
        o.nextMusic();
    });

    // 再生開始
    this.startMusic = function(url) {
        this.audioObj.attr('src', this.musicUrl + url);
        this.audioObj.attr('autoplay', true);
    };

    // サーバから次の曲を取得する
    this.nextMusic = function() {
        $.ajax({
            type: 'POST',
            url : '/next',
            cache: false,
            data: { 
                'current_music_name' : o.currentMusicName,
                'ext' : this.ext
            },
            success: function(msg) {
                o.currentMusicName = msg.nextMusicName;
                o.titleArea.html(o.currentMusicName);
                o.startMusic(o.currentMusicName);
            },
            dataType: "json"
        });
    };

    // 対応音声形式を調べる
    this.check = function() {
        try {
            var audio = new Audio("");
            if (audio.canPlayType) {
                if ( "" != audio.canPlayType("audio/mpeg") ) {
                    this.ext = "mp3";
                } 
                else if ( "" != audio.canPlayType("audio/ogg") ) {
                    this.ext = "ogg";
                }
            } else {
                throw "対応してません";
            }
        } catch (e) {
            this.ext = null;
        }
    };
};
