// IndexedDB 操作，用于存储导出的密钥 (JWK)
// IndexedDB operations for storing exported keys (JWK)
function openDB() {
    return new Promise((resolve, reject) => {
        // 打开名为 "encryptionDB" 的 IndexedDB 数据库，版本号为 1
        // Open the IndexedDB database named "encryptionDB" with version number 1
        const request = indexedDB.open("encryptionDB", 1);
        request.onupgradeneeded = event => {
            // 获取数据库实例
            // Get the database instance
            const db = event.target.result;
            // 检查是否存在名为 "keys" 的对象存储
            // Check if there is an object store named "keys"
            if (!db.objectStoreNames.contains("keys")) {
                // 如果不存在，则创建名为 "keys" 的对象存储，使用 "id" 作为键路径
                // If not, create an object store named "keys" with "id" as the key path
                db.createObjectStore("keys", { keyPath: "id" });
            }
        };
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
}

/**
 * 将 JWK 格式的密钥存储到 IndexedDB 中
 * Stores the JWK formatted key in IndexedDB
 * @param {Object} jwk - 要存储的 JWK 格式的密钥
 * @param {Object} jwk - The JWK formatted key to be stored
 * @returns {Promise} - 存储操作完成的 Promise
 * @returns {Promise} - A Promise that resolves when the storage operation is completed
 */
async function storeKey(jwk) {
    // 打开数据库
    // Open the database
    const db = await openDB();
    return new Promise((resolve, reject) => {
        // 开启一个读写事务，操作 "keys" 对象存储
        // Start a read-write transaction to operate on the "keys" object store
        const transaction = db.transaction(["keys"], "readwrite");
        // 获取 "keys" 对象存储
        // Get the "keys" object store
        const store = transaction.objectStore("keys");
        // 向对象存储中插入或更新一个键值对
        // Insert or update a key-value pair in the object store
        const request = store.put({ id: "encryptionKey", jwk });
        request.onsuccess = () => resolve();
        request.onerror = event => reject(event.target.error);
    });
}

/**
 * 从 IndexedDB 中获取加密密钥
 * Retrieves the encryption key from IndexedDB
 * @returns {Promise<Object|null>} - 包含 JWK 格式密钥的 Promise，如果未找到则返回 null
 * @returns {Promise<Object|null>} - A Promise containing the JWK formatted key, or null if not found
 */
async function getKeyFromDB() {
    // 打开数据库
    // Open the database
    const db = await openDB();
    return new Promise((resolve, reject) => {
        // 开启一个只读事务，操作 "keys" 对象存储
        // Start a read-only transaction to operate on the "keys" object store
        const transaction = db.transaction(["keys"], "readonly");
        // 获取 "keys" 对象存储
        // Get the "keys" object store
        const store = transaction.objectStore("keys");
        // 根据键 "encryptionKey" 获取对象
        // Get the object by the key "encryptionKey"
        const request = store.get("encryptionKey");
        request.onsuccess = event => {
            // 如果找到对象，则返回其 JWK 格式的密钥，否则返回 null
            // If the object is found, return its JWK formatted key, otherwise return null
            resolve(event.target.result ? event.target.result.jwk : null);
        };
        request.onerror = event => reject(event.target.error);
    });
}

/**
 * 获取加密密钥：若已存储则导入，否则生成新密钥并保存
 * Gets the encryption key: imports it if already stored, otherwise generates a new key and saves it
 * @returns {Promise<CryptoKey>} - 包含加密密钥的 Promise
 * @returns {Promise<CryptoKey>} - A Promise containing the encryption key
 */
async function getEncryptionKey() {
    // 从数据库中获取 JWK 格式的密钥
    // Retrieve the JWK formatted key from the database
    let jwk = await getKeyFromDB();
    if (jwk) {
        // 如果存在，则导入该密钥
        // If it exists, import the key
        return crypto.subtle.importKey(
            "jwk",
            jwk,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    } else {
        // 如果不存在，则生成一个新的密钥
        // If it doesn't exist, generate a new key
        let key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        // 导出新生成的密钥为 JWK 格式
        // Export the newly generated key to JWK format
        let exported = await crypto.subtle.exportKey("jwk", key);
        // 将导出的密钥存储到数据库中
        // Store the exported key in the database
        await storeKey(exported);
        return key;
    }
}

/**
 * 辅助函数：将 ArrayBuffer 转换为十六进制字符串
 * Helper function: Converts an ArrayBuffer to a hexadecimal string
 * @param {ArrayBuffer} buffer - 要转换的 ArrayBuffer
 * @param {ArrayBuffer} buffer - The ArrayBuffer to be converted
 * @returns {string} - 转换后的十六进制字符串
 * @returns {string} - The converted hexadecimal string
 */
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        // 将每个字节转换为两位的十六进制字符串
        // Convert each byte to a two-digit hexadecimal string
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * 辅助函数：将十六进制字符串转换为 Uint8Array
 * Helper function: Converts a hexadecimal string to a Uint8Array
 * @param {string} hex - 要转换的十六进制字符串
 * @param {string} hex - The hexadecimal string to be converted
 * @returns {Uint8Array} - 转换后的 Uint8Array
 * @returns {Uint8Array} - The converted Uint8Array
 */
function hexToBuffer(hex) {
    // 将十六进制字符串按每两个字符分割成数组，并将每个元素转换为整数
    // Split the hexadecimal string into an array of two-character elements and convert each element to an integer
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return bytes;
}

/**
 * 加密函数，输出格式：JM-<iv_hex>:<cipher_hex>
 * Encryption function, output format: JM-<iv_hex>:<cipher_hex>
 * @param {CryptoKey} key - 用于加密的密钥
 * @param {CryptoKey} key - The key used for encryption
 * @param {string} data - 要加密的明文数据
 * @param {string} data - The plaintext data to be encrypted
 * @returns {Promise<string>} - 包含加密后数据的 Promise
 * @returns {Promise<string>} - A Promise containing the encrypted data
 */
async function encryptData(key, data) {
    // 生成一个 12 字节的随机初始化向量 (IV)
    // Generate a 12-byte random initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    // 将明文数据编码为 Uint8Array
    // Encode the plaintext data to a Uint8Array
    const encoded = new TextEncoder().encode(data);
    // 使用 AES-GCM 算法对数据进行加密
    // Encrypt the data using the AES-GCM algorithm
    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );
    // 将 IV 转换为十六进制字符串
    // Convert the IV to a hexadecimal string
    const ivHex = bufferToHex(iv);
    // 将加密后的缓冲区转换为十六进制字符串
    // Convert the encrypted buffer to a hexadecimal string
    const cipherHex = bufferToHex(cipherBuffer);
    return "JM-" + ivHex + ":" + cipherHex;
}

/**
 * 解密函数，要求加密数据以 JM- 开头
 * Decryption function, requires the encrypted data to start with JM-
 * @param {CryptoKey} key - 用于解密的密钥
 * @param {CryptoKey} key - The key used for decryption
 * @param {string} encrypted - 要解密的加密数据
 * @param {string} encrypted - The encrypted data to be decrypted
 * @returns {Promise<string>} - 包含解密后明文数据的 Promise
 * @returns {Promise<string>} - A Promise containing the decrypted plaintext data
 */
async function decryptData(key, encrypted) {
    // 检查加密数据是否以 "JM-" 开头
    // Check if the encrypted data starts with "JM-"
    if (!encrypted.startsWith("JM-")) {
        throw new Error("数据格式错误");
    }
    // 去除 "JM-" 前缀
    // Remove the "JM-" prefix
    const data = encrypted.slice(3);
    // 分割 IV 和密文的十六进制字符串
    // Split the hexadecimal strings of the IV and ciphertext
    const [ivHex, cipherHex] = data.split(":");
    // 将 IV 的十六进制字符串转换为 Uint8Array
    // Convert the hexadecimal string of the IV to a Uint8Array
    const iv = hexToBuffer(ivHex);
    // 将密文的十六进制字符串转换为 Uint8Array
    // Convert the hexadecimal string of the ciphertext to a Uint8Array
    const cipherBuffer = hexToBuffer(cipherHex);
    // 使用 AES-GCM 算法对数据进行解密
    // Decrypt the data using the AES-GCM algorithm
    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherBuffer
    );
    // 将解密后的缓冲区解码为字符串
    // Decode the decrypted buffer to a string
    return new TextDecoder().decode(plainBuffer);
}