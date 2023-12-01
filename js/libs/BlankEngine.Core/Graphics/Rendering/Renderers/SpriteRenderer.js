class SpriteRenderer extends Renderer
{
    #sprite = null;
    #spriteOld = null;
    
    get sprite ()
    {
        return this.#spriteOld;
    }
    
    set sprite (value)
    {
        this.#sprite = value;
        
        this.Reload();
    }
    
    constructor (sprite, material)
    {
        super(material);
        
        this.sprite = sprite;
    }
    
    Reload ()
    {
        if (!this.#sprite.texture.isLoaded)
        {
            requestAnimationFrame(() => this.Reload());
            
            return;
        }
        
        super.Reload();
        
        this.#spriteOld = this.#sprite;
    }
    
    Render ()
    {
        if (!this.isLoaded || !this.gameObject.activeSelf) return;
        
        const gl = this.material.gl;
        
        const vertices = this.sprite.vertices;
        const tris = this.sprite.triangles;
        
        let rectArray = [];
        
        for (let i = 0; i < tris.length; i++)
        {
            const vertex = vertices[tris[i]];
            const index = i * 2;
            
            rectArray[index] = vertex.x;
            rectArray[index + 1] = vertex.y;
        }
        
        const ppu = this.sprite.pixelPerUnit;
        const texX = this.sprite.texture.width;
        const texY = this.sprite.texture.height;
        
        let scale = null;
        let ppuScaler = 0;
        
        if (texX > texY)
        {
            scale = new Vector2(1, texY / texX);
            
            ppuScaler = texX / ppu;
        }
        else
        {
            scale = new Vector2(texX / texY, 1);
            
            ppuScaler = texY / ppu;
        }
        
        scale = Vector2.Scale(scale, ppuScaler);
        
        const scalePos = Vector2.Scale(Vector2.Subtract(Vector2.one, scale), -0.5);
        
        const rectPos = vertices[0];
        
        const center = new Vector2(
            ((rectPos.x + 0.5 * (vertices[3].x - rectPos.x)) - 0.5) * scale.x,
            ((rectPos.y + 0.5 * (vertices[3].y - rectPos.y)) - 0.5) * scale.y
        );
        
        const offset = Vector2.Add(
            this.sprite.pivot,
            Vector2.Add(
                scalePos,
                center
            )
        );
        
        const localMatrix = Matrix3x3.Multiply(
            this.localSpaceMatrix,
            Matrix3x3.TRS(
                Vector2.Scale(offset, -1),
                0,
                scale
            )
        );
        
        this.material.color = this.color;
        
        this.material.SetMatrix(this.uMatrixID,
            localMatrix.matrix[0][0],
            localMatrix.matrix[0][1],
            localMatrix.matrix[0][2],
            localMatrix.matrix[1][0],
            localMatrix.matrix[1][1],
            localMatrix.matrix[1][2],
            localMatrix.matrix[2][0],
            localMatrix.matrix[2][1],
            localMatrix.matrix[2][2]
        );
        
        this.material.SetBuffer(this.geometryBufferID, rectArray);
        this.material.SetBuffer(this.textureBufferID, rectArray);
        
        this.material.SetAttribute(this.aVertexPosID, this.geometryBufferID);
        this.material.SetAttribute(this.aTexturePosID, this.textureBufferID);
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture.GetNativeTexture());
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, tris.length);
        
        gl.useProgram(null);
    }
}