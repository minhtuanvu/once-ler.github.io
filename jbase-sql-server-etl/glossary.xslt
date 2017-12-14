<?xml version="1.0"?>
<!-- this is an xml document -->
<!-- declare the xsl namespace to distinguish xsl tags from html tags -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  
  <xsl:variable name="newLine"><br/></xsl:variable>
  <xsl:variable name="space">@nbsp;</xsl:variable>

  <xsl:template name="string-replace-html">
    <xsl:param name="text"/>
    <xsl:param name="replace"/>
    <xsl:param name="by"/>
    <xsl:choose>
      <xsl:when test="not($replace) and $text != ''">
        <xsl:text>test</xsl:text>
      </xsl:when>
      <xsl:when test="not($replace)" />
      <xsl:when test="contains($text,$replace)">
        <xsl:value-of select="substring-before($text,$replace)"/>
        <xsl:choose>
          <xsl:when test="$by = $newLine">
            <br/>
          </xsl:when>
          <xsl:when test="$by = $space">
            &#160;
          </xsl:when>
        </xsl:choose>
        <xsl:call-template name="string-replace-html">
          <xsl:with-param name="text" select="substring-after($text,$replace)"/>
          <xsl:with-param name="replace" select="$replace"/>
          <xsl:with-param name="by" select="$by"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- When we see a <keyword> element... -->
  <xsl:template match="keyword">
    <h2 style="margin-top:0px;margin-bottom:5px;"><xsl:value-of select="@name"/></h2>
    <xsl:apply-templates select="type"/>  <!-- and recurse for other templates -->
    <xsl:apply-templates select="description"/>
    <xsl:apply-templates select="usage"/>
    <xsl:apply-templates select="example"/>
    <xsl:apply-templates select="figure"/>
  </xsl:template>
<!-- When we see a <type> element... -->
  <xsl:template match="type">
    <p><span style="font-weight:bold;">Type: </span><xsl:value-of select="."/></p>
  </xsl:template>
  <!-- When we see an <description> element... -->
  <xsl:template match="description">
    <table style="width:625px;margin-bottom:5px;" cellspacing="0" cellpadding="5">
      <tr>
        <th style="text-align:left;">Description</th>
      </tr>
      <xsl:choose>
        <xsl:when test="count(child::descriptionPattern) &gt; 0">
          <xsl:apply-templates select="descriptionPattern"/>
        </xsl:when>
        <xsl:otherwise>
          <tr>
            <td>
              <table style="width:625px;" cellspacing="0" cellpadding="5">
                <xsl:choose>
                  <xsl:when test="count(child::tables) &gt; 0">
                    <tr style="background:#f3f3f3;">
                      <td>
                        <xsl:apply-templates select="tables"/>
                      </td>
                    </tr>
                  </xsl:when>
                  <xsl:otherwise>
                    <tr style="background:#f3f3f3;">
                      <td>
                        <xsl:variable name="var1">
                          <xsl:call-template name="string-replace-html">
                            <xsl:with-param name="text" select="."/>
                            <xsl:with-param name="replace" select="'@space'"/>
                            <xsl:with-param name="by" select="$space"/>
                          </xsl:call-template>
                        </xsl:variable>
                        <xsl:call-template name="string-replace-html">
                          <xsl:with-param name="text" select="$var1"/>
                          <xsl:with-param name="replace" select="'@newLine'"/>
                          <xsl:with-param name="by" select="$newLine"/>
                        </xsl:call-template>
                      </td>
                    </tr>
                  </xsl:otherwise>
                </xsl:choose>
              </table>
            </td>
          </tr>
        </xsl:otherwise>
      </xsl:choose>
    </table>
  </xsl:template>
  <!-- When we see an <descriptionPattern> element... -->
  <xsl:template match="descriptionPattern">
    <tr>
      <td>
        <table style="width:625px;" cellspacing="0" cellpadding="5">
          <xsl:choose>
            <xsl:when test="count(child::tables) &gt; 0">
              <tr>
                <td>
                  <xsl:apply-templates select="tables"/>
                </td>
              </tr>
            </xsl:when>
            <xsl:otherwise>
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:variable name="var1">
                    <xsl:call-template name="string-replace-html">
                      <xsl:with-param name="text" select="."/>
                      <xsl:with-param name="replace" select="'@space'"/>
                      <xsl:with-param name="by" select="$space"/>
                    </xsl:call-template>
                  </xsl:variable>
                  <xsl:call-template name="string-replace-html">
                    <xsl:with-param name="text" select="$var1"/>
                    <xsl:with-param name="replace" select="'@newLine'"/>
                    <xsl:with-param name="by" select="$newLine"/>
                  </xsl:call-template>
                </td>
              </tr>
            </xsl:otherwise>
          </xsl:choose>
        </table>
      </td>
    </tr>
  </xsl:template>

  <!-- When we see an <usage> element... -->
  <xsl:template match="usage">
    <table style="width:625px;margin-bottom:5px;" cellspacing="0" cellpadding="5">
      <tr>
        <th style="text-align:left;">Usage</th>
      </tr>
      <xsl:choose>
        <xsl:when test="count(child::node()) &gt; 1">
          <xsl:apply-templates select="usagePattern"/>
        </xsl:when>
        <xsl:otherwise>
          <tr style="background:#f3f3f3;">
            <td>
              <xsl:variable name="var1">
                <xsl:call-template name="string-replace-html">
                  <xsl:with-param name="text" select="."/>
                  <xsl:with-param name="replace" select="'@space'"/>
                  <xsl:with-param name="by" select="$space"/>
                </xsl:call-template>
              </xsl:variable>
              <xsl:call-template name="string-replace-html">
                <xsl:with-param name="text" select="$var1"/>
                <xsl:with-param name="replace" select="'@newLine'"/>
                <xsl:with-param name="by" select="$newLine"/>
              </xsl:call-template>
            </td>
          </tr>
        </xsl:otherwise>
      </xsl:choose>
    </table>
  </xsl:template>
  <!-- When we see an <usagePattern> element... -->
  <xsl:template match="usagePattern">
    <tr style="background:#f3f3f3;">
      <td>
        <xsl:variable name="var1">
          <xsl:call-template name="string-replace-html">
            <xsl:with-param name="text" select="."/>
            <xsl:with-param name="replace" select="'@space'"/>
            <xsl:with-param name="by" select="$space"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:call-template name="string-replace-html">
          <xsl:with-param name="text" select="$var1"/>
          <xsl:with-param name="replace" select="'@newLine'"/>
          <xsl:with-param name="by" select="$newLine"/>
        </xsl:call-template>
      </td>
    </tr>
  </xsl:template>

  <!-- When we see an <example> element... -->
  <xsl:template match="example">
    <table style="width:625px;margin-bottom:5px;" cellspacing="0" cellpadding="5">
      <tr>
        <th style="text-align:left;">Example</th>
      </tr>
      <xsl:choose>
        <xsl:when test="count(child::node()) &gt; 1">
          <xsl:apply-templates select="examplePattern"/>
        </xsl:when>
        <xsl:otherwise>
          <tr style="background:#f3f3f3;">
            <td>
              <xsl:variable name="var1">
                <xsl:call-template name="string-replace-html">
                  <xsl:with-param name="text" select="."/>
                  <xsl:with-param name="replace" select="'@space'"/>
                  <xsl:with-param name="by" select="$space"/>
                </xsl:call-template>
              </xsl:variable>
              <xsl:call-template name="string-replace-html">
                <xsl:with-param name="text" select="$var1"/>
                <xsl:with-param name="replace" select="'@newLine'"/>
                <xsl:with-param name="by" select="$newLine"/>
              </xsl:call-template>
            </td>
          </tr>
        </xsl:otherwise>
      </xsl:choose>
    </table>
  </xsl:template>
  <!-- When we see an <examplePattern> element... -->
  <xsl:template match="examplePattern">
    <tr>
      <td>
        <table style="width:625px;" cellspacing="0" cellpadding="5">
          <xsl:choose>
            <xsl:when test="count(child::tables) &gt; 0">
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:apply-templates select="tables"/>
                </td>
              </tr>  
            </xsl:when>
            <xsl:otherwise>
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:variable name="var1">
                    <xsl:call-template name="string-replace-html">
                      <xsl:with-param name="text" select="."/>
                      <xsl:with-param name="replace" select="'@space'"/>
                      <xsl:with-param name="by" select="$space"/>
                    </xsl:call-template>
                  </xsl:variable>
                  <xsl:call-template name="string-replace-html">
                    <xsl:with-param name="text" select="$var1"/>
                    <xsl:with-param name="replace" select="'@newLine'"/>
                    <xsl:with-param name="by" select="$newLine"/>
                  </xsl:call-template>
                </td>
              </tr>
            </xsl:otherwise>
          </xsl:choose>        
        </table>
      </td>
    </tr>
  </xsl:template>
  <!--
  <xsl:template match="examplePattern">
    <tr style="background:#f3f3f3;">
      <td>
        <xsl:variable name="var1">
          <xsl:call-template name="string-replace-html">
            <xsl:with-param name="text" select="."/>
            <xsl:with-param name="replace" select="'@space'"/>
            <xsl:with-param name="by" select="$space"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:call-template name="string-replace-html">
          <xsl:with-param name="text" select="$var1"/>
          <xsl:with-param name="replace" select="'@newLine'"/>
          <xsl:with-param name="by" select="$newLine"/>
        </xsl:call-template>
      </td>
    </tr>
  </xsl:template>
-->

  <!-- When we see an <tables> element... -->
  <xsl:template match="tables">
    <xsl:for-each select="table">

      <xsl:choose>
        <xsl:when test="@title != ''">
          <p style="font-weight:bold;">
            <xsl:value-of select="@title"/>
          </p>
        </xsl:when>
      </xsl:choose>

      <table style="border:1px solid black;background-color:#f5f5f5;border-spacing:0px;border-collapse:collapse;"  cellspacing="0" cellpadding="0">
        <xsl:choose>
          <xsl:when test="@style != ''">
            <xsl:attribute name="style">
              <xsl:value-of select="@style"/>
            </xsl:attribute>
          </xsl:when>
        </xsl:choose>
        <tr>
          <xsl:for-each select="tr/th">
            <th style="background-color:Lavender;padding:5px;text-align:left;border: 1px solid #333333;">
              <xsl:choose>
                <xsl:when test="@style != ''">
                  <xsl:attribute name="style">
                    <xsl:value-of select="@style"/>
                  </xsl:attribute>
                </xsl:when>
              </xsl:choose>
              <xsl:value-of select="."/>
            </th>
          </xsl:for-each>
        </tr>
        <xsl:for-each select="tr">
          <tr>
            <xsl:for-each select="td">
              <td>
                <!-- overwrite style:  style="text-align:left;vertical-align:top;border:1px solid RosyBrown;padding:3px 5px;" -->
                <xsl:choose>
                  <xsl:when test="@style != ''">
                    <xsl:attribute name="style">
                      <xsl:value-of select="@style"/>
                    </xsl:attribute>
                  </xsl:when>
                </xsl:choose>

                <xsl:choose>
                  <xsl:when test="count(child::tdDiv) &gt; 0">
                    <div>
                      <!-- for stretching pic -->
                      <xsl:for-each select="tdDiv">
                        <xsl:choose>
                          <xsl:when test="@style != ''">
                            <xsl:attribute name="style">
                              <xsl:value-of select="@style"/>
                            </xsl:attribute>
                          </xsl:when>
                        </xsl:choose>
                        <xsl:choose>
                          <xsl:when test="@src != ''">
                            <img>
                              <xsl:choose>
                                <xsl:when test="@imgStyle != ''">
                                  <xsl:attribute name="style">
                                    <xsl:value-of select="@imgStyle"/>
                                  </xsl:attribute>
                                </xsl:when>
                              </xsl:choose>
                              <xsl:choose>
                                <xsl:when test="@src != ''">
                                  <xsl:attribute name="src">
                                    <xsl:value-of select="@src"/>
                                  </xsl:attribute>
                                </xsl:when>
                              </xsl:choose>
                              <xsl:choose>
                                <xsl:when test="@alt != ''">
                                  <xsl:attribute name="alt">
                                    <xsl:value-of select="@alt"/>
                                  </xsl:attribute>
                                </xsl:when>
                              </xsl:choose>
                              <xsl:attribute name="width">
                                <xsl:value-of select="'100%'"/>
                              </xsl:attribute>
                              <xsl:attribute name="height">
                                <xsl:value-of select="'100%'"/>
                              </xsl:attribute>
                            </img>
                          </xsl:when>
                        </xsl:choose>
                        <!-- fin -->
                        <xsl:choose>
                          <xsl:when test="count(child::tdContent) &gt; 0">
                            <div style="z-index:1;position:absolute;top:15px;left:0px;">
                              <xsl:for-each select="tdContent">
                                <span style="display:list-item;text-align:left;margin-left:20px;">
                                  <xsl:choose>
                                    <xsl:when test="@style != ''">
                                      <xsl:attribute name="style">
                                        <xsl:value-of select="@style"/>
                                      </xsl:attribute>
                                    </xsl:when>
                                  </xsl:choose>

                                  <xsl:value-of select="@text"/>
                                </span>
                              </xsl:for-each>
                            </div>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:value-of select="."/>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:for-each>
                    </div>
                  </xsl:when>
                  <xsl:otherwise>

                    <xsl:choose>
                      <xsl:when test="count(child::tdContent) &gt; 0">
                        <xsl:for-each select="tdContent">
                          <span>
                            <xsl:choose>
                              <xsl:when test="@style != ''">
                                <xsl:attribute name="style">
                                  <xsl:value-of select="@style"/>
                                </xsl:attribute>
                              </xsl:when>
                            </xsl:choose>
                            <xsl:value-of select="@text"/>
                          </span>
                        </xsl:for-each>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="."/>
                      </xsl:otherwise>
                    </xsl:choose>

                  </xsl:otherwise>
                </xsl:choose>
              </td>
            </xsl:for-each>
          </tr>
        </xsl:for-each>
      </table>
    </xsl:for-each>
  </xsl:template>

  <!-- When we see an <images> element... -->
  <xsl:template match="images">
      <xsl:for-each select="img">
        <div style="width:610px;overflow:auto;">
          <p style="font-weight:bold;">
            <xsl:value-of select="@alt"/>
          </p>
          <img>
            <xsl:attribute name="src">
              <xsl:value-of select="@src"/>
            </xsl:attribute>
            <xsl:attribute name="alt">
              <xsl:value-of select="@alt"/>
            </xsl:attribute>
          </img>
        </div>
      </xsl:for-each>
  </xsl:template>

  <!-- When we see an <figure> element... -->
  <xsl:template match="figure">
    <table style="width:625px;margin-bottom:5px;" cellspacing="0" cellpadding="5">
      <xsl:choose>
        <xsl:when test="count(child::figurePattern) &gt; 0">
          <xsl:apply-templates select="figurePattern"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="count(child::images) &gt; 0">
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:apply-templates select="images"/>
                </td>
              </tr>
            </xsl:when>
            <xsl:otherwise>
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:variable name="var1">
                    <xsl:call-template name="string-replace-html">
                      <xsl:with-param name="text" select="."/>
                      <xsl:with-param name="replace" select="'@space'"/>
                      <xsl:with-param name="by" select="$space"/>
                    </xsl:call-template>
                  </xsl:variable>
                  <xsl:call-template name="string-replace-html">
                    <xsl:with-param name="text" select="$var1"/>
                    <xsl:with-param name="replace" select="'@newLine'"/>
                    <xsl:with-param name="by" select="$newLine"/>
                  </xsl:call-template>
                </td>
              </tr>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </table>
  </xsl:template>
  <!-- When we see an <figurePattern> element... -->
  <xsl:template match="figurePattern">
    <tr>
      <td>
        <table style="width:625px;" cellspacing="0" cellpadding="5">
          <xsl:choose>
            <xsl:when test="count(child::images) &gt; 0">
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:apply-templates select="images"/>
                </td>
              </tr>
            </xsl:when>
            <xsl:otherwise>
              <tr style="background:#f3f3f3;">
                <td>
                  <xsl:variable name="var1">
                    <xsl:call-template name="string-replace-html">
                      <xsl:with-param name="text" select="."/>
                      <xsl:with-param name="replace" select="'@space'"/>
                      <xsl:with-param name="by" select="$space"/>
                    </xsl:call-template>
                  </xsl:variable>
                  <xsl:call-template name="string-replace-html">
                    <xsl:with-param name="text" select="$var1"/>
                    <xsl:with-param name="replace" select="'@newLine'"/>
                    <xsl:with-param name="by" select="$newLine"/>
                  </xsl:call-template>
                </td>
              </tr>
            </xsl:otherwise>
          </xsl:choose>
        </table>
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet>



