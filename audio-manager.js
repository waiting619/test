/**
 * 遊戲音效管理器
 * 提供統一的音效播放接口，支援所有遊戲
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;
        this.currentMusic = null;
        
        // 預定義音效路徑（使用線上資源）
        this.soundPaths = {
            // 通用音效
            'click': 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
            'button': 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3',
            'success': 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            'error': 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
            'gameOver': 'https://assets.mixkit.co/sfx/preview/mixkit-game-over-tetris-2047.mp3',
            
            // 貪食蛇遊戲音效
            'snakeEat': 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
            'snakeMove': 'https://assets.mixkit.co/sfx/preview/mixkit-retro-game-emergency-alarm-1000.mp3',
            'snakeCrash': 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-explosion-2759.mp3',
            
            // 2048遊戲音效
            'tileMove': 'https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3',
            'tileMerge': 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            'tileAppear': 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3',
            
            // 保護氣球遊戲音效
            'shoot': 'https://assets.mixkit.co/sfx/preview/mixkit-laser-weapon-shot-1671.mp3',
            'explosion': 'https://assets.mixkit.co/sfx/preview/mixkit-bomb-explosion-in-battle-2800.mp3',
            'powerup': 'https://assets.mixkit.co/sfx/preview/mixkit-extra-bonus-in-a-video-game-2045.mp3',
            'balloonHit': 'https://assets.mixkit.co/sfx/preview/mixkit-balloon-pop-2878.mp3',
            'enemyHit': 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-explosion-2800.mp3'
        };
        
        // 背景音樂路徑
        this.musicPaths = {
            'mainMenu': 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3',
            'snakeGame': 'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3',
            'puzzleGame': 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
            'arcadeGame': 'https://assets.mixkit.co/music/preview/mixkit-arcade-space-shooter-829.mp3',
            'gameOver': 'https://assets.mixkit.co/music/preview/mixkit-sad-game-over-trombone-471.mp3'
        };
        
        // 初始化音效
        this.init();
    }
    
    /**
     * 初始化音效系統
     */
    init() {
        console.log('音效管理器初始化中...');
        
        // 創建音效元素
        for (const [key, url] of Object.entries(this.soundPaths)) {
            this.sounds[key] = new Audio();
            this.sounds[key].src = url;
            this.sounds[key].preload = 'auto';
            this.sounds[key].volume = this.soundVolume;
        }
        
        // 創建音樂元素
        for (const [key, url] of Object.entries(this.musicPaths)) {
            this.music[key] = new Audio();
            this.music[key].src = url;
            this.music[key].preload = 'auto';
            this.music[key].volume = this.musicVolume;
            this.music[key].loop = true;
        }
        
        // 檢查瀏覽器是否支援音效
        this.checkAudioSupport();
    }
    
    /**
     * 檢查瀏覽器音效支援
     */
    checkAudioSupport() {
        const audio = new Audio();
        if (typeof audio.play === 'function') {
            console.log('瀏覽器支援音效播放');
            return true;
        } else {
            console.warn('瀏覽器不支援音效播放');
            return false;
        }
    }
    
    /**
     * 播放音效
     * @param {string} soundName - 音效名稱
     * @param {number} volume - 音量 (0-1)
     */
    playSound(soundName, volume = null) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName];
            
            // 重置音效以便重複播放
            sound.currentTime = 0;
            
            // 設置音量
            if (volume !== null) {
                sound.volume = Math.min(1, Math.max(0, volume));
            } else {
                sound.volume = this.soundVolume;
            }
            
            // 播放音效
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`音效播放失敗: ${soundName}`, error);
                });
            }
        } catch (error) {
            console.warn(`播放音效時出錯: ${soundName}`, error);
        }
    }
    
    /**
     * 播放背景音樂
     * @param {string} musicName - 音樂名稱
     * @param {boolean} loop - 是否循環播放
     */
    playMusic(musicName, loop = true) {
        if (this.isMuted || !this.music[musicName]) return;
        
        // 停止當前音樂
        this.stopMusic();
        
        try {
            const music = this.music[musicName];
            music.loop = loop;
            music.volume = this.musicVolume;
            this.currentMusic = musicName;
            
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`背景音樂播放失敗: ${musicName}`, error);
                });
            }
        } catch (error) {
            console.warn(`播放背景音樂時出錯: ${musicName}`, error);
        }
    }
    
    /**
     * 停止背景音樂
     */
    stopMusic() {
        if (this.currentMusic && this.music[this.currentMusic]) {
            try {
                const music = this.music[this.currentMusic];
                music.pause();
                music.currentTime = 0;
            } catch (error) {
                console.warn('停止背景音樂時出錯', error);
            }
        }
        this.currentMusic = null;
    }
    
    /**
     * 暫停背景音樂
     */
    pauseMusic() {
        if (this.currentMusic && this.music[this.currentMusic]) {
            try {
                this.music[this.currentMusic].pause();
            } catch (error) {
                console.warn('暫停背景音樂時出錯', error);
            }
        }
    }
    
    /**
     * 恢復背景音樂
     */
    resumeMusic() {
        if (this.currentMusic && this.music[this.currentMusic] && !this.isMuted) {
            try {
                this.music[this.currentMusic].play();
            } catch (error) {
                console.warn('恢復背景音樂時出錯', error);
            }
        }
    }
    
    /**
     * 設置靜音
     * @param {boolean} muted - 是否靜音
     */
    setMuted(muted) {
        this.isMuted = muted;
        
        if (muted) {
            this.pauseMusic();
            
            // 靜音所有音效
            Object.values(this.sounds).forEach(sound => {
                sound.volume = 0;
            });
        } else {
            this.resumeMusic();
            
            // 恢復音效音量
            Object.values(this.sounds).forEach(sound => {
                sound.volume = this.soundVolume;
            });
        }
        
        // 保存設置到本地存儲
        localStorage.setItem('gameAudioMuted', muted);
    }
    
    /**
     * 切換靜音狀態
     */
    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }
    
    /**
     * 設置音效音量
     * @param {number} volume - 音量 (0-1)
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.min(1, Math.max(0, volume));
        
        if (!this.isMuted) {
            Object.values(this.sounds).forEach(sound => {
                sound.volume = this.soundVolume;
            });
        }
        
        localStorage.setItem('gameSoundVolume', this.soundVolume);
    }
    
    /**
     * 設置音樂音量
     * @param {number} volume - 音量 (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.min(1, Math.max(0, volume));
        
        if (!this.isMuted && this.currentMusic && this.music[this.currentMusic]) {
            this.music[this.currentMusic].volume = this.musicVolume;
        }
        
        localStorage.setItem('gameMusicVolume', this.musicVolume);
    }
    
    /**
     * 從本地存儲加載設置
     */
    loadSettings() {
        const muted = localStorage.getItem('gameAudioMuted');
        if (muted !== null) {
            this.isMuted = muted === 'true';
        }
        
        const soundVolume = localStorage.getItem('gameSoundVolume');
        if (soundVolume !== null) {
            this.soundVolume = parseFloat(soundVolume);
        }
        
        const musicVolume = localStorage.getItem('gameMusicVolume');
        if (musicVolume !== null) {
            this.musicVolume = parseFloat(musicVolume);
        }
    }
    
    /**
     * 創建音效控制UI
     * @param {HTMLElement} container - 容器元素
     */
    createAudioControls(container) {
        const controlsHTML = `
            <div class="audio-controls" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 10px;
                z-index: 1000;
                font-family: Arial, sans-serif;
                min-width: 200px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            ">
                <h3 style="margin: 0 0 10px 0; font-size: 16px;">音效設置</h3>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">
                        <input type="checkbox" id="muteToggle" ${this.isMuted ? 'checked' : ''}>
                        靜音
                    </label>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">
                        音效音量: <span id="soundVolumeValue">${Math.round(this.soundVolume * 100)}%</span>
                    </label>
                    <input type="range" id="soundVolumeSlider" min="0" max="100" value="${Math.round(this.soundVolume * 100)}" 
                           style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">
                        音樂音量: <span id="musicVolumeValue">${Math.round(this.musicVolume * 100)}%</span>
                    </label>
                    <input type="range" id="musicVolumeSlider" min="0" max="100" value="${Math.round(this.musicVolume * 100)}" 
                           style="width: 100%;">
                </div>
                
                <button id="closeAudioControls" style="
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-top: 5px;
                ">關閉</button>
            </div>
        `;
        
        container.innerHTML = controlsHTML;
        
        // 綁定事件
        const muteToggle = document.getElementById('muteToggle');
        const soundVolumeSlider = document.getElementById('soundVolumeSlider');
        const musicVolumeSlider = document.getElementById('musicVolumeSlider');
        const soundVolumeValue = document.getElementById('soundVolumeValue');
        const musicVolumeValue = document.getElementById('musicVolumeValue');
        const closeButton = document.getElementById('closeAudioControls');
        
        muteToggle.addEventListener('change', (e) => {
            this.setMuted(e.target.checked);
        });
        
        soundVolumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setSoundVolume(volume);
            soundVolumeValue.textContent = `${e.target.value}%`;
        });
        
        musicVolumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setMusicVolume(volume);
            musicVolumeValue.textContent = `${e.target.value}%`;
        });
        
        closeButton.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }
    
    /**
     * 創建簡易音效開關按鈕
     * @param {HTMLElement} container - 容器元素
     */
    createSimpleToggle(container) {
        const buttonHTML = `
            <button id="audioToggle" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${this.isMuted ? '#666' : '#4CAF50'};
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 999;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                ${this.isMuted ? '🔇' : '🔊'}
            </button>
        `;
        
        container.innerHTML = buttonHTML;
        
        const audioToggle = document.getElementById('audioToggle');
        audioToggle.addEventListener('click', () => {
            const isMuted = this.toggleMute();
            audioToggle.style.background = isMuted ? '#666' : '#4CAF50';
            audioToggle.innerHTML = isMuted ? '🔇' : '🔊';
        });
    }
}

// 創建全局音效管理器實例
window.gameAudio = new AudioManager();

// 加載設置
window.gameAudio.loadSettings();

// 導出音效管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
