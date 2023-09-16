!
!    ABAQUS format UINTER-2D subroutine
!
!    Author: Siyuan Song (BROWN)
!    Date: July 19 2018 (v1.00)
!
!    This Subroutine is a test UINTER: The traction stress is a constant number in the field, Dugdale Model
!
!    The file also contains the following subrouines:
!    
!
! ======================= Variables to be defined ==========================================
!
! 01.
! STRESS(NDIR):
! This array is passed in as the stress between the slave and master surfaces at the beginning of the increment and must be updated in this routine to be the stress at the end of the increment. The stress must be defined in a local coordinate system (see ALOCDIR). This variable must be defined for a stress/displacement or a fully coupled temperature-displacement analysis. The sign convention for stresses is that a positive stress indicates compression across contact surfaces, while a negative stress indicates tension.
!
! 02.
! DDSDDR(NDIR,NDIR):
! Interface stiffness matrix. DDSDDR(I,J) defines the change in the Ith stress component at the end of the time increment caused by an infinitesimal perturbation of the Jth component of the relative displacement increment array. Unless you invoke the unsymmetric equation solution capability in the contact property model definition (“Use with the unsymmetric equation solver in ABAQUS/Standard” in “User-defined interfacial constitutive behavior,” Section 30.1.6 of the ABAQUS Analysis User's Manual), ABAQUS/Standard will use only the symmetric part of DDSDDR. This variable must be defined for a stress/displacement or a fully coupled temperature-displacement analysis to ensure proper convergence characteristics.
!
! 03.
! FLUX(2):
! Magnitude of the heat flux flowing into the slave and master surfaces, respectively. This array is passed in as the value at the beginning of the increment and must be updated to the flux at the end of the increment. The convention for defining the flux is that a positive flux indicates heat flowing into a surface, while a negative flux indicates heat flowing out of the surface. This variable must be defined for a heat transfer or a fully coupled temperature-displacement analysis. The sum of these two flux terms represents the heat generated in the interface, and the difference in these flux terms represents the heat conducted through the interface.
!
! 04.
! DDFDDT(2,2):
! The negative of the variation of the flux at the two surfaces with respect to their respective temperatures, for a fixed relative displacement. This variable must be defined for a heat transfer or a fully coupled temperature-displacement analysis to ensure proper convergence characteristics. The entries in the first row contain the negatives of the derivatives of FLUX(1) with respect to TEMP(1) and TEMP(2), respectively. The entries in the second row contain the negatives of the corresponding derivatives of FLUX(2).

! 05.
! DDSDDT(NDIR,2):
! Variation of the stress with respect to the temperatures of the two surfaces for a fixed relative displacement. This variable is required only for thermally coupled elements (in a fully coupled temperature-displacement analysis), in which the stress is a function of the surface temperatures. DDSDDT(NDIR,1) corresponds to the slave surface, and DDSDDT(NDIR,2) corresponds to the master surface.
!
! 06.
! DDFDDR(2,NDIR):
! Variation of the flux with respect to the relative displacement between the two surfaces. This variable is required only for thermally coupled elements (in a fully coupled temperature-displacement analysis), in which the flux is a function of the relative displacement. DDFDDR(1,NDIR) corresponds to the slave surface, and DDFDDR(2,NDIR) corresponds to the master surface.
!
!
! ======\(^o^)/=============\(^o^)/============= \(^o^)/===========\(^o^)/==========\(^o^)/============
! ======================= Variables that can be defined ==========================================
!
!
! 07.
! STATEV(NSTATV):
! An array containing the solution-dependent state variables. These are passed in as values at the beginning of the increment and must be returned as values at the end of the increment. You define the number of available state variables as described in “Allocating space” in “User subroutines: overview,” Section 13.2.1 of the ABAQUS Analysis User's Manual.
!
! 08.
! SED:
! This variable is passed in as the value of the elastic energy density at the start of the increment and should be updated to the elastic energy density at the end of the increment. This variable is used for output only and has no effect on other solution variables. It contributes to the output variable ALLSE.
!
! 09.
! SFD:
! This variable should be defined as the incremental frictional dissipation. The units are energy per unit area. This variable is used for output only and has no effect on other solution variables. It contributes to the output variables ALLFD and SFDR (and related variables). For computing its contribution to SFDR, SFD is divided by the time increment.
!
! 10.
! SPD:
! This variable should be defined as the incremental dissipation due to plasticity effects in the interfacial constitutive behavior. The units are energy per unit area. This variable is used for output only and has no effect on other solution variables. It contributes to the output variable ALLPD.
!
! 11.
! SVD:
! This variable should be defined as the incremental dissipation due to viscous effects in the interfacial constitutive behavior. The units are energy per unit area. This variable is used for output only and has no effect on other solution variables. It contributes to the output variable ALLVD.

! 12.
! SCD:
! This variable should be defined as the incremental dissipation due to creep effects in the interfacial constitutive behavior. The units are energy per unit area. This variable is used for output only and has no effect on other solution variables. It contributes to the output variable ALLCD.
!
! 13.
! PNEWDT:
! Ratio of suggested new time increment to the time increment currently being used (DTIME, see below). This variable allows you to provide input to the automatic time incrementation algorithms in ABAQUS/Standard (if automatic time incrementation is chosen).
! PNEWDT is set to a large value before each call to UINTER.
! If PNEWDT is redefined to be less than 1.0, ABAQUS/Standard must abandon the time increment and attempt it again with a smaller time increment. The suggested new time increment provided to the automatic time integration algorithms is PNEWDT � DTIME, where the PNEWDT used is the minimum value for all calls to user subroutines that allow redefinition of PNEWDT for this iteration.
! If PNEWDT is given a value that is greater than 1.0 for all calls to user subroutines for this iteration and the increment converges in this iteration, ABAQUS/Standard may increase the time increment. The suggested new time increment provided to the automatic time integration algorithms is PNEWDT � DTIME, where the PNEWDT used is the minimum value for all calls to user subroutines for this iteration.
! If automatic time incrementation is not selected in the analysis procedure, values of PNEWDT greater than 1.0 will be ignored and values of PNEWDT less than 1.0 will cause the job to terminate.
!
! 14.
! LOPENCLOSE:
! An integer flag that is used to track the contact status in situations where user subroutine UINTER is used to model standard contact between two surfaces, like the default hard contact model in ABAQUS/Standard. It comes in as the value at the beginning of the current iteration and should be set to the value at the end of the current iteration. It is set to –1 at the beginning of the analysis before UINTER is called. You should set it to 0 to indicate an open status and to 1 to indicate a closed status. A change in this flag from one iteration to the next will have two effects. It will result in output related to a change in contact status if you request a detailed contact printout in the message file (“The ABAQUS/Standard message file” in “Output,” Section 4.1.1 of the ABAQUS Analysis User's Manual). In addition, it will also trigger a severe discontinuity iteration. Any time this flag is reset to a value of –1, ABAQUS/Standard assumes that the flag is not being used. A change in this flag from –1 to another value or vice versa will not have any of the above effects.
!
! 15.
! LSTATE:
! An integer flag that should be used in non-standard contact situations where a simple open/close status is not appropriate or enough to describe the state. It comes in as the value at the beginning of the current iteration and should be set to the value at the end of the current iteration. It is set to –1 at the beginning of the analysis before UINTER is called. It can be assigned any user-defined integer value, each corresponding to a different state. You can track changes in the value of this flag and use it to output appropriate diagnostic messages to the message file (unit 7). You may choose to output diagnostic messages only when a detailed contact printout is requested (“The ABAQUS/Standard message file” in “Output,” Section 4.1.1 of the ABAQUS Analysis User's Manual). In the latter case, the LPRINT parameter is useful. In conjunction with the LSTATE flag, you may also utilize the LSDI flag to trigger a severe discontinuity iteration any time the state changes from one iteration to the next. Any time this flag is reset to a value of –1, ABAQUS/Standard assumes that the flag is not being used.
!
! 16.
! LSDI:
! This flag is set to 0 before each call to UINTER and should be set to 1 if the current iteration should be treated as a severe discontinuity iteration. This would typically be done in non-standard contact situations based on a change in the value of the LSTATE flag from one iteration to the next. The use of this flag has no effect when the LOPENCLOSE flag is also used. In that case, severe discontinuity iterations are determined based on changes in the value of LOPENCLOSE alone.
!
!
! ======================o(≥v≤)o~~=========== o(≥v≤)o~~=============o(≥v≤)o~~==========o(≥v≤)o~~===
! ======================= Variables passed in for information ==========================================
!
!
! 17.
! RDISP(NDIR):
! An array containing the current relative positions between the two surfaces at the end of the increment. The first component is the relative position of the point on the slave surface, with respect to the master surface, in the normal direction. The second and third components, if applicable, are the accumulated incremental relative tangential displacements, measured from the beginning of the analysis. For the relative position in the normal direction a negative quantity represents an open status, while a positive quantity indicates penetration into the master surface. For open points on the slave surface for which no pairing master is found, the first component is a very large negative number (–1 � 1036). The local directions in which the relative displacements are defined are stored in ALOCALDIR.
!
! 18.
! DRDISP(NDIR):
! An array containing the increments in relative positions between the two surfaces.
! 
! 19.
! TEMP(2):
! Temperature at the end of the increment at a point on the slave surface and the opposing master surface, respectively.
!
! 20.
! DTEMP(2):
! Increment in temperature at the point on the slave surface and the opposing master surface, respectively.
!
! 21.
! PREDEF(2,NPRED):
! An array containing pairs of values of all the predefined field variables at the end of the current increment (initial values at the beginning of the analysis and current values during the analysis). The first value in a pair, PREDEF(1,NPRED), corresponds to the value at the point on the slave surface, and the second value, PFREDEF(2,NPRED), corresponds to the value of the field variable at the nearest point on the opposing surface.
!
! 22.
! DPRED(2,NPRED):
! Array of increments in predefined field variables.
!
! 23.
! TIME(1):
! Value of step time at the end of the increment.
! 
! 24.
! TIME(2):
! Value of total time at the end of the increment.
!
! 25.
! DTIME：
! Current increment in time.
!
! 26.
! CINAME:
! User-specified surface interaction name, left justified.
!
! 27.
! SLNAME:
! Slave surface name.
!
! 28.
! MSNAME:
! Master surface name.
!
! 29.
! PROPS(NPROPS):
! User-specified array of property values to define the interfacial constitutive behavior between the contacting surfaces.
!
! 30.  
! COORDS(MCRD):
! An array containing the current coordinates of this point.
!
! 31.
! ALOCALDIR(3,3):
! An array containing the direction cosines of the local surface coordinate system. The directions are stored in columns. For example, ALOCALDIR(1,1), ALOCALDIR(2,1), and ALOCALDIR(3,1) give the (1, 2, 3) components of the normal direction. Thus, the first direction is the normal direction to the surface, and the remaining two directions are the slip directions in the plane of the surface. The local system is defined by the geometry of the master surface. The convention for the local directions is the same as the convention in situations where the model uses the built-in contact capabilities in ABAQUS/Standard (described in “Contact formulation for ABAQUS/Standard contact pairs,” Section 29.2.2 of the ABAQUS Analysis User's Manual, for the tangential directions).
!
! 32.
! DROT(2,2):
! Rotation increment matrix. For contact with a three-dimensional rigid surface, this matrix represents the incremental rotation of the surface directions relative to the rigid surface. It is provided so that vector- or tensor-valued state variables can be rotated appropriately in this subroutine. Relative displacement components are already rotated by this amount before UINTER is called. This matrix is passed in as a unit matrix for two-dimensional and axisymmetric contact problems.
!
! 33.
! AREA:
! Surface area associated with the contact point.
!
! 34.
! CHRLNGTH:
! Characteristic contact surface face dimension.
!
! 35.
! NODE:
! User-defined global slave node number (or internal node number for models defined in terms of an assembly of part instances) involved with this contact point. Passed in as zero if the finite-sliding, surface-to-surface contact formulation is used.
!
! 36.
! NDIR:
! Number of force components at this point.
!
! 37.
! NSTATV:
! Number of solution-dependent state variables.
!
! 38.
! NPRED:
! Number of predefined field variables.
! 
! 39.
! NPROPS:
! User-defined number of property values associated with this interfacial constitutive model (“Interfacial constants” in “User-defined interfacial constitutive behavior,” Section 30.1.6 of the ABAQUS Analysis User's Manual).
! 
! 40.
! MCRD:
! Number of coordinate directions at the contact point.
!
! 41.
! KSTEP:
! Step number.
!
! 42.
! KINC:
! Increment number.
!
! 43.
! KIT:
! Iteration number. KIT=0 for the first assembly, KIT=1 for the first recovery/second assembly, KIT=2 for the second recovery/third assembly, and so on.
!
! 44.
! LINPER:
! Linear perturbation flag. LINPER=1 if the step is a linear perturbation step. LINPER=0 if the step is a general step. For a linear perturbation step, the inputs to user subroutine UINTER represent perturbation quantities about the base state. The user-defined quantities in UINTER are also perturbation quantities. The Jacobian terms should be based on the base state. No change in contact status should occur during a linear perturbation step.
!
! 45.
! LPRINT:
! This flag is equal to 1 if a detailed contact printout to the message file is requested and 0 otherwise (“The ABAQUS/Standard message file” in “Output,” Section 4.1.1 of the ABAQUS Analysis User's Manual). This flag can be used to print out diagnostic messages regarding changes in contact status selectively only when a detailed contact printout is requested.


!
      subroutine uinter(stress,ddsddr,amki,amski,flux,ddfddt,ddsddt,
     1     ddfddr,statev,sed,sfd,spd,svd,scd,pnewdt,rdisp,drdisp,
     2     temp,dtemp,predef,dpred,time,dtime,freqr,ciname,slname,
     3     msname,props,coords,aLocalDir,drot,area,chrLngth,node,ndir,
     4     nstatv,npred,nprops,mcrd,kstep,kinc,kit,linper,lOpenClose,
     5     lState,lSdi,lPrint)
!
      include 'aba_param.inc'
! 
      dimension stress(ndir),ddsddr(ndir,ndir),flux(2),ddfddt(2,2),
     $     ddsddt(ndir,2),ddfddr(2,ndir),statev(nstatv),rdisp(ndir),
     $     drdisp(ndir),temp(2),dtemp(2),predef(2,npred),dpred(2,npred),
     $     time(2),props(nprops),coords(mcrd),aLocalDir(mcrd,mcrd),
     $     drot(2,2),amki(ndir,ndir),amski(ndir,ndir)
      character*80 ciname,slname,msname
      parameter(toler = 1.D-12, zero=0.d0, one=1.d0, two=2.d0,
     $     half = one/two)
       
       Real , parameter  :: PI = 3.1415926
       !
       
       double precision  ::  h                                ! h = rdisp(1). Distance in normal direction
       
       ! Material Parameters
       
       double precision  ::  sigma_0                          
       double precision  ::  q
       double precision  ::  delta
       double precision  ::  p_inf
       
! =============================================================================
! ============================= Main Function ================================= 
       
! ===== Part 1 ===== 
! ============================= Initialization ================================
! ====                                                              ====

! ====                                                              ====
! =============================================================================
! ====                                                              ====
! ==== Material properties ====
      sigma_0 = props(1) ! The constant stress in the cohesive zone
      q = props(2) ! The maximum distance of the cohesive zone. In the distance range (q_0,q), the cohesive stress is constant
      delta = props(3) ! The minimum distance of the cohesive zone. In the distance range (0,q_0), the cohesive stress is p
      p_inf = props(4) ! The maximum pressure at h = 0, p_inf should be very large.
! ==== Local variables     ====
!      h = zero
      h = rdisp(1) ! Normal Distance
! ====                                                              ====
! =============================================================================

! ===== Part 2 ===== 
! ============================= Const. Eq. ==================================== 
!      if ( abs(q + delta + h) .le. 0.0001 ) then
!          LSDI = 1
!      endif
! ====                                                              ====
!    Case 1: -h <= delta
      if ( -h .le. delta ) then
          ! Stress Components
          stress(1) = (p_inf - sigma_0) / (delta**2) * ((h + delta)**2)
     1    - sigma_0 - 0.01 * sigma_0
          stress(2) = 0
          ! Jacobian Matrix
          ddsddr(1,1) = 2 * (p_inf - sigma_0) / (delta**2) * (h + delta)
!          ddsddr(1,2) = 0
!          ddsddr(2,1) = 0
!          ddsddr(2,2) = 0
          ! Area, State Variable
          statev(1) = AREA
!          WRITE(*,*) 'case 1'
      end if
!    Case 2: delta < -h < q
      if (( -h .gt. delta ) .and. ( -h .lt. q )) then
          ! Stress Components
          stress(1) = - sigma_0 + sigma_0 * 0.01 * 
     1    (-h - q)/(q - delta)
          stress(2) = 0
          ! Jacobian Matrix
          ddsddr(1,1) = sigma_0 * 0.01 * (-1)/(q - delta)
!          ddsddr(1,2) = 0
!          ddsddr(2,1) = 0
!          ddsddr(2,2) = 0
          ! Area, State Variable
          statev(1) = 0
!          WRITE(*,*) 'case 2'
      end if
!    Case 3: q <= -h <= q + delta
      if (( -h .ge. q ) .and. ( -h .le. (q + delta) )) then
          ! Stress Components
          stress(1) = - sigma_0/2 * COS((h+q)/delta*PI) - sigma_0/2
          stress(2) = 0
          ! Jacobian Matrix
          ddsddr(1,1) = sigma_0/2 * PI/delta * SIN((h+q)/delta*PI)
!          ddsddr(1,2) = 0
!          ddsddr(2,1) = 0
!          ddsddr(2,2) = 0
          ! Area, State Variable
          statev(1) = 0
!          WRITE(*,*) 'case 3'
      end if
!    Case 4: q + delta < -h
      if ( -h .gt. (q + delta) ) then
          ! Stress Components
          stress(1) = 0
          stress(2) = 0
          ! Jacobian Matrix
          ddsddr(1,1) = 0
!          ddsddr(1,2) = 0
!          ddsddr(2,1) = 0
!          ddsddr(2,2) = 0
          ! Area, State Variable
          statev(1) = 0
!          WRITE(*,*) 'case 4'
      end if
! ====                                                              ====
! ===== Part 2 ===== 
c For test - SSY
      WRITE(*,*) 'h = ', h
!      WRITE(*,*) 'rdsip(1) = ', rdisp(1)
!      WRITE(*,*) 'rdsip(2) = ', rdisp(2)
!      WRITE(*,*) 'Normal Stress = ', stress(1)
!      WRITE(*,*) 'Friction = ', stress(2)
!      WRITE(*,*) 'AREA = ', AREA
!      WRITE(*,*) 'KINC = ', KINC
!      WRITE(*,*) 'KIT = ', KIT
!      WRITE(*,*) 'TIME(1) = ', TIME(1)
!      WRITE(*,*) 'DTIME = ', DTIME
c For test - End
! ============================= End ==================================== 
      return
     
      END