<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="2019.08.14" name="sprites" tilewidth="8" tileheight="8" tilecount="256" columns="16">
 <image source="sprites.png" trans="000000" width="128" height="128"/>
 <terraintypes>
  <terrain name="New Terrain" tile="49"/>
  <terrain name="New Terrain" tile="49"/>
 </terraintypes>
 <tile id="0">
  <animation>
   <frame tileid="0" duration="100"/>
   <frame tileid="1" duration="100"/>
  </animation>
 </tile>
 <tile id="1">
  <properties>
   <property name="type" value="hero"/>
  </properties>
 </tile>
 <tile id="81" terrain=",,,1"/>
 <tile id="82" terrain=",,1,1"/>
 <tile id="83" terrain=",,1,"/>
 <tile id="97" terrain=",1,,1"/>
 <tile id="98" terrain="1,1,1,1"/>
 <tile id="99" terrain="1,,1,"/>
 <tile id="102" terrain="1,1,1,"/>
 <tile id="103" terrain="1,1,,1"/>
 <tile id="113" terrain=",1,,"/>
 <tile id="114" terrain="1,1,,"/>
 <tile id="115" terrain="1,,,"/>
 <tile id="118" terrain="1,,1,1"/>
 <tile id="119" terrain=",1,1,1"/>
 <tile id="161" terrain=",,,0"/>
 <tile id="162" terrain=",,0,0"/>
 <tile id="163" terrain=",,0,"/>
 <tile id="164" terrain="0,0,0,"/>
 <tile id="165" terrain="0,0,,0"/>
 <tile id="177" terrain=",0,,0"/>
 <tile id="178" terrain="0,0,0,0"/>
 <tile id="179" terrain="0,,0,"/>
 <tile id="180" terrain="0,,0,0"/>
 <tile id="181" terrain=",0,0,0"/>
 <tile id="193" terrain=",0,,"/>
 <tile id="194" terrain="0,0,,"/>
 <tile id="195" terrain="0,,,"/>
 <tile id="196" terrain="0,,,0"/>
 <tile id="197" terrain=",0,0,"/>
 <wangsets>
  <wangset name="New Wang Set" tile="-1"/>
 </wangsets>
</tileset>
