class Renderer extends Component
{
    #loaded = false;
    
    #material = null;
    #materialOld = null;
    
    uMatrixID = 0;
    geometryBufferID = 0;
    textureBufferID = 0;
    aVertexPosID = 0;
    aTexturePosID = 0;
    
    color = Color.white;
    localSpaceMatrix = new Matrix3x3();
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get material ()
    {
        return this.#materialOld;
    }
    
    set material (value)
    {
        this.#material = value;
        
        this.Reload();
    }
    
    constructor (material)
    {
        super();
        
        this.#material = material ?? new Material();
    }
    
    Reload ()
    {
        const gl = this.#material.gl;
        
        this.#material.SetSampler2D("uSampler", 0);
        
        const geometryBuffer = this.#material.AddBuffer("geometry", null, 2);
        const textureBuffer = this.#material.AddBuffer("texture", null, 2);
        
        this.#materialOld = this.#material;
        
        this.uMatrixID = this.material.GetPropertyNameID("uMatrix");
        
        this.geometryBufferID = geometryBuffer;
        this.textureBufferID = textureBuffer;
        
        this.aVertexPosID = this.material.GetAttributeNameID("aVertexPos");
        this.aTexturePosID = this.material.GetAttributeNameID("aTexturePos");
        
        this.#loaded = true;
    }
    
    Render () { }
}